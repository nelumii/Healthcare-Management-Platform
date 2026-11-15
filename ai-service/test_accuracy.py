import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import os

def test_model():
    try:
        # 1. Load Training Data
        train_path = os.path.join(os.path.dirname(__file__), "Training.csv")
        test_path = os.path.join(os.path.dirname(__file__), "Testing.csv")
        
        train_df = pd.read_csv(train_path)
        test_df = pd.read_csv(test_path)
        
        # Data Cleaning: Drop unnamed trailing columns in both
        if train_df.columns[-1].startswith("Unnamed"):
            train_df = train_df.iloc[:, :-1]
        if test_df.columns[-1].startswith("Unnamed"):
            test_df = test_df.iloc[:, :-1]
            
        # Clean column names
        train_df.columns = [c.strip() for c in train_df.columns]
        test_df.columns = [c.strip() for c in test_df.columns]
        
        # 2. X and y preparation
        X_train = train_df.drop("prognosis", axis=1)
        y_train = train_df["prognosis"]
        
        X_test = test_df.drop("prognosis", axis=1)
        y_test = test_df["prognosis"]
        
        # Ensure columns match between train and test
        X_test = X_test[X_train.columns]
        
        # 3. Train the model
        print("Training Case-Based Random Forest Model...")
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # 4. Predict on Test set
        print("Predicting against Testing.csv...")
        y_pred = model.predict(X_test)
        
        # 5. Measure Accuracy
        accuracy = accuracy_score(y_test, y_pred)
        
        print("\n" + "="*50)
        print(f"📊 MODEL ACCURACY: {accuracy * 100:.2f}%")
        print("="*50)
        
        print("\nDetailed Classification Report:")
        print(classification_report(y_test, y_pred))
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")

if __name__ == "__main__":
    test_model()
