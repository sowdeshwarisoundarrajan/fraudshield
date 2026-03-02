import pandas as pd
import numpy as np
from sklearn.utils import resample

np.random.seed(42)
n = 10000

# Normal transactions with some variation
normal = pd.DataFrame({
    'amount':           np.random.exponential(500, n) + np.random.normal(0, 100, n),
    'hour':             np.random.randint(0, 24, n),
    'location_match':   np.random.choice([0,1], n, p=[0.1, 0.9]),
    'device_match':     np.random.choice([0,1], n, p=[0.15, 0.85]),
    'failed_attempts':  np.random.choice([0,1,2,3,4], n, p=[0.7,0.15,0.08,0.04,0.03]),
    'is_fraud':         np.zeros(n, dtype=int)
})

# Fraud transactions — overlapping with normal (realistic)
fraud = pd.DataFrame({
    'amount':           np.random.exponential(3000, n//5) + np.random.normal(0, 500, n//5),
    'hour':             np.random.choice(range(24), n//5),
    'location_match':   np.random.choice([0,1], n//5, p=[0.6, 0.4]),
    'device_match':     np.random.choice([0,1], n//5, p=[0.55, 0.45]),
    'failed_attempts':  np.random.choice([0,1,2,3,4], n//5, p=[0.2,0.2,0.2,0.2,0.2]),
    'is_fraud':         np.ones(n//5, dtype=int)
})

# Combine
df = pd.concat([normal, fraud]).reset_index(drop=True)

# Clip negative values
df['amount'] = df['amount'].clip(lower=1)
df['failed_attempts'] = df['failed_attempts'].clip(lower=0, upper=4)

# Shuffle
df = df.sample(frac=1, random_state=42).reset_index(drop=True)
df.to_csv('transactions.csv', index=False)

print(f"Total: {len(df)}")
print(f"Normal: {len(df[df.is_fraud==0])}")
print(f"Fraud:  {len(df[df.is_fraud==1])}")
print("✅ Realistic dataset created!")