import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
import pickle

# Load data
df = pd.read_csv('../data/transactions.csv')
X = df.drop('is_fraud', axis=1)
y = df['is_fraud']

# Scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# Function to print results
def evaluate(name, y_test, y_pred):
    print(f"\n{'='*40}")
    print(f"  {name}")
    print(f"{'='*40}")
    print(f"  Accuracy:  {accuracy_score(y_test, y_pred)*100:.2f}%")
    print(f"  Precision: {precision_score(y_test, y_pred)*100:.2f}%")
    print(f"  Recall:    {recall_score(y_test, y_pred)*100:.2f}%")
    print(f"  F1 Score:  {f1_score(y_test, y_pred)*100:.2f}%")
    print(f"{'='*40}")

# Model 1: XGBoost
xgb = XGBClassifier(n_estimators=200, random_state=42)
xgb.fit(X_train, y_train)
evaluate("XGBoost", y_test, xgb.predict(X_test))

# Model 2: Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
evaluate("Random Forest", y_test, rf.predict(X_test))

# Model 3: Logistic Regression
lr = LogisticRegression(random_state=42)
lr.fit(X_train, y_train)
evaluate("Logistic Regression", y_test, lr.predict(X_test))

# Model 4: Isolation Forest
iso = IsolationForest(contamination=0.04, random_state=42)
iso.fit(X_scaled)
iso_pred = iso.predict(X_test)
iso_pred = [1 if x == -1 else 0 for x in iso_pred]
evaluate("Isolation Forest", y_test, iso_pred)

# Summary
print("\n")
print("="*40)
print("  SUMMARY — BEST ALGORITHM")
print("="*40)
models = {
    "XGBoost": f1_score(y_test, xgb.predict(X_test)),
    "Random Forest": f1_score(y_test, rf.predict(X_test)),
    "Logistic Regression": f1_score(y_test, lr.predict(X_test)),
    "Isolation Forest": f1_score(y_test, iso_pred),
}
best = max(models, key=models.get)
for name, score in models.items():
    print(f"  {name}: {score*100:.2f}% F1")
print(f"\n  🏆 BEST: {best}")
print("="*40)