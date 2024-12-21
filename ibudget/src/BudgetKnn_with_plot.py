#!/usr/bin/env python
# coding: utf-8

# In[1]:


import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy
import sklearn
import tensorflow
import keras
import csv
import matplotlib.pyplot as plt


# In[2]:


def calculateSilhoutteScore(df_scaled, metrics, column):
    from sklearn.metrics import silhouette_score
    silhouette = silhouette_score(df_scaled, metrics[column])
    return silhouette


# In[3]:


def DataTypeCorrection(columnList, df):
    for column in columnList:
        if column == 'TransactionDate':
            df[column] = pd.to_datetime(df[column], errors='coerce')
        elif column == 'CustomerID' or column == 'Quantity' or column == 'Price' or column == 'DiscountApplied(%)' or column == 'TotalAmount':
            df[column] = pd.to_numeric(df[column], errors='coerce')

    return df


# In[4]:


def process_and_concat(inputDf, dbDf):
    columns_to_remove = ["username", "itemName", "storeName"]
    inputDf = inputDf.drop(columns=columns_to_remove, errors='ignore')
    column_mapping = {
        "customerID": "CustomerID",
        "purchaseId": "ProductID",
        "quantity": "Quantity",
        "price": "Price",
        "transactionDate": "TransactionDate",
        "paymentMethod": "PaymentMethod",
        "storeLocation": "StoreLocation",
        "category": "ProductCategory",
        "discount": "DiscountApplied(%)",
        "totalAmount": "TotalAmount"
    }

    inputDf = inputDf.rename(columns=column_mapping)
    inputDf = inputDf[dbDf.columns]

    concatenated_df = pd.concat([dbDf, DataTypeCorrection(list(inputDf.columns), inputDf)], ignore_index=True)
    return concatenated_df


# In[5]:


db_csv_file_path = 's3://ibudget-purchases-bucket/transaction-data/Retail_Transaction_df.csv'
##db_df = pd.read_csv(db_csv_file_path)


# In[6]:


user_csv_file_path = 's3://ibudget-purchases-bucket/unprocessedInputs/To_Be_Processed.csv'#enter path to csv file of customer data from website
#user_df = pd.read_csv(user_csv_file_path)


# In[ ]:





# In[7]:


#db_csv_file_path = 'Retail_Transaction_df.csv'
#input_path = 'results.csv'
df = process_and_concat(pd.read_csv(user_csv_file_path), pd.read_csv(db_csv_file_path))


# In[ ]:





# In[8]:


#We want to output the concat result back to Retail_Transaction_df
#to update the db and can so that it can be use again for model building in future runs
df.to_csv(db_csv_file_path, index=False, mode='w')


# In[ ]:





# In[9]:


num_attribs = ["Quantity", "Price", "DiscountApplied(%)", "TotalAmount"]
from scipy.stats import zscore

z_scores = np.abs(zscore(df[num_attribs]))
outliers = (z_scores > 3).any(axis=1)

df = df[~outliers]


# In[10]:


customer_metrics = df.groupby("CustomerID").agg({
    "Quantity": "sum",
    "Price": "mean",
    "DiscountApplied(%)": "mean",
    "TotalAmount": ["sum", "mean", "count"],  
}).reset_index()

customer_metrics.columns = [
    "CustomerID", "TotalQuantity", "AvgPrice", "AvgDiscount", 
    "TotalSpending", "AvgSpending", "TransactionCount"
]


# In[11]:


from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import FunctionTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

num_attribs = ["TotalQuantity", "AvgPrice", "AvgDiscount", "TotalSpending", "AvgSpending", "TransactionCount"]
#cat_attribs = ["AvgPaymentMethod"]


# Log-transform pipeline for numeric data
log_transformer = Pipeline([
    ("log", FunctionTransformer(func=np.log1p, validate=True)),
    ("scaler", StandardScaler())
])

num_pipeline = Pipeline([
    ("imputer", SimpleImputer(add_indicator=True, strategy="median")),
    ("log_transform", log_transformer)
])

cat_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("cat_encoder", OneHotEncoder(sparse_output=False))
])

preprocess_pipeline = ColumnTransformer([
    ("num", num_pipeline, num_attribs),
    #("cat", cat_pipeline, cat_attribs)
])


# In[12]:


df_scaled = preprocess_pipeline.fit_transform(customer_metrics[num_attribs])


# In[ ]:





# In[13]:


from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

kmeans = KMeans(n_clusters=3, random_state=42)
customer_metrics["cluster"] = kmeans.fit_predict(df_scaled)


# In[14]:


#silhouette score with no outliers removed: 0.24330643841291696
#silhouette score after outliers are removed: 0.38152009979483226


# In[15]:


def GenerateAOV(cluster_df):
    spender_aov = cluster_df.groupby('CustomerID')['TotalSpending'].mean().reset_index()
    spender_aov.rename(columns={'TotalSpending': 'average_order_value'}, inplace=True)
    spending_users = customer_metrics.merge(spender_aov, on='CustomerID', how='left')
    spending_users.dropna()
    return spending_users


# In[ ]:





# In[16]:


low_spending_users = customer_metrics[customer_metrics['cluster'] == 0]
low_spending_users_df = GenerateAOV(low_spending_users)


# In[17]:


medium_spending_users = customer_metrics[customer_metrics['cluster'] == 1]
medium_spending_users_df = GenerateAOV(medium_spending_users)


# In[18]:


high_spending_users = customer_metrics[customer_metrics['cluster'] == 2]
high_spending_users_df = GenerateAOV(high_spending_users)


# In[19]:


aov_df = pd.concat([low_spending_users_df, medium_spending_users_df, high_spending_users_df], ignore_index=True)
aov_df = aov_df.dropna()


# In[20]:


def generate_budgeting_plan(user):
    plan = {
        'spending_limit': 0,
        'saving_goal': 0,
        'custom_tips': []
    }
    if user['cluster'] == 2:
        plan['spender_type'] = 'High Spender'
        plan['spending_limit'] = user['average_order_value'] * 0.8
        plan['saving_goal'] = user['average_order_value'] * 0.2
        plan['custom_tips'] = [
            "Set aside a portion of your income for an emergency fund.",
            "Track all expenses to identify areas for potential savings.",
            "Prioritize needs over wants in your monthly budget."
        ]
    elif user['cluster'] == 1:
        plan['spender_type'] = 'Medium Spender'
        plan['spending_limit'] = user['AvgSpending'] * 0.9
        plan['saving_goal'] = user['AvgSpending'] * 0.1
        plan['custom_tips'] = [
            "Plan your purchases in advance to avoid overspending.",
            "Set a weekly spending cap to manage expenses better.",
            "Consider automating your savings to grow your wealth passively."
        ]
    elif user['cluster'] == 0:
        plan['spender_type'] = 'Low Spender'
        plan['spending_limit'] = user['AvgSpending']
        plan['saving_goal'] = user['AvgSpending'] * 0.05
        plan['custom_tips'] = [
            "Look for opportunities to increase income or invest.",
            "Avoid over-saving at the cost of essential needs.",
            "Explore budget-friendly options for discretionary spending."
        ]
    plan['luxury_spending_percentage'] = user['AvgPrice'] / user['TotalSpending'] * 100
    plan['essential_spending_percentage'] = 100 - plan['luxury_spending_percentage']
    plan['estimated_monthly_spending'] = user['TotalSpending'] / user['TransactionCount']
    
    return plan


# In[21]:


aov_df['budgeting_plan'] = aov_df.apply(generate_budgeting_plan, axis=1)


# In[22]:


model_output_csv_file_path = 's3://ibudget-purchases-bucket/ml-output-data/Retail_Transaction_ML.csv'
try: 
    aov_df.to_csv(model_output_csv_file_path, index=False, mode='w')
    print(f"Data successfully saved to {model_output_csv_file_path}")
except Exception as e:
    print(f"failed to save to s3: {e}")
    raise RuntimeError("Stopping execution due ot error. ") from e


# In[23]:


import boto3
bucket_name = "ibudget-purchases-bucket"
prefix = "unprocessedInputs/" 

s3 = boto3.client('s3')

try:
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    if 'Contents' in response:
        objects_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]
        delete_response = s3.delete_objects(
            Bucket=bucket_name,
            Delete={'Objects': objects_to_delete}
        )
        print("Deleted files:", delete_response)
    else:
        print("No files found in the specified S3 path.")

except Exception as e:
    print(f"Error deleting files: {e}")


# In[ ]:




