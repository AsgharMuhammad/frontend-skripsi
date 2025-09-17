@@ .. @@
 import React, { useState } from "react";
 import {
   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
 } from "recharts";
+import "./App.css";

 function App() {
   const [selectedFile, setSelectedFile] = useState(null);
   const [chartData, setChartData] = useState([]);
   const [metrics, setMetrics] = useState(null);
+  const [isLoading, setIsLoading] = useState(false);

   const handleFileChange = (e) => {
     setSelectedFile(e.target.files[0]);
   };

   const handleUpload = async () => {
     if (!selectedFile) return alert("Pilih file CSV dulu!");

+    setIsLoading(true);
     const formData = new FormData();
     formData.append("file", selectedFile);

     try {
       const resp = await fetch("http://127.0.0.1:8000/upload_predict", {
         method: "POST",
         body: formData,
       });

       const json = await resp.json();
       console.log("RESP JSON:", json);

       // Gabungkan dates, actuals, dan predictions
       const merged = json.dates.map((d, i) => ({
         date: d,
         actual: json.actuals ? json.actuals[i] : null,
         prediction: json.predictions[i],
       }));

       setChartData(merged);
       setMetrics(json.metrics);
     } catch (err) {
       console.error("Upload error:", err);
+      alert("Terjadi kesalahan saat memproses file. Silakan coba lagi.");
+    } finally {
+      setIsLoading(false);
     }
   };

   return (
-    <div className="App" style={{ padding: "20px", background: "#111", color: "white", minHeight: "100vh" }}>
-      <h1>Model Prediksi Harga Reksa Dana Berbasis Data Mining Dengan Algoritma Random Forest</h1>
-      <h1>Muhammad Asghar (F1G121006)</h1>
-      <input type="file" onChange={handleFileChange} />
-      <button onClick={handleUpload}>Upload & Predict</button>
+    <div className="app-container">
+      <div className="main-container">
+        <div className="header">
+          <h1 className="main-title">
+            Model Prediksi Harga Reksa Dana Berbasis Data Mining
+          </h1>
+          <p className="subtitle">Algoritma Random Forest</p>
+          <p className="author">Muhammad Asghar (F1G121006)</p>
+        </div>

+        <div className="upload-section">
+          <h2 className="upload-title">Upload Data CSV</h2>
+          <div className="upload-controls">
+            <div className="file-input-wrapper">
+              <input 
+                type="file" 
+                onChange={handleFileChange} 
+                className="file-input"
+                accept=".csv"
+                id="file-upload"
+              />
+              <label htmlFor="file-upload" className="file-input-label">
+                {selectedFile ? selectedFile.name : "Pilih file CSV"}
+              </label>
+            </div>
+            <button 
+              onClick={handleUpload} 
+              className={`upload-button ${isLoading ? 'loading' : ''}`}
+              disabled={!selectedFile || isLoading}
+            >
+              {isLoading ? "Memproses..." : "Upload & Predict"}
+            </button>
+          </div>
+        </div>

-      {/* Hasil Evaluasi Model */}
-      {metrics && (
-        <div style={{ marginTop: "20px" }}>
-          <h2>Hasil Evaluasi Model</h2>
-          <table border="1" style={{ borderCollapse: "collapse", width: "50%", color: "white" }}>
-            <tbody>
-              <tr><td>MAE</td><td>{metrics.mae}</td></tr>
-              <tr><td>MSE</td><td>{metrics.mse}</td></tr>
-              <tr><td>RMSE</td><td>{metrics.rmse}</td></tr>
-            </tbody>
-          </table>
-        </div>
-      )}
+        {/* Hasil Evaluasi Model */}
+        {metrics && (
+          <div className="metrics-section">
+            <h2 className="section-title metrics">Hasil Evaluasi Model</h2>
+            <div className="metrics-grid">
+              <div className="metric-card">
+                <div className="metric-label">Mean Absolute Error</div>
+                <div className="metric-value">{parseFloat(metrics.mae).toFixed(4)}</div>
+              </div>
+              <div className="metric-card">
+                <div className="metric-label">Mean Squared Error</div>
+                <div className="metric-value">{parseFloat(metrics.mse).toFixed(4)}</div>
+              </div>
+              <div className="metric-card">
+                <div className="metric-label">Root Mean Squared Error</div>
+                <div className="metric-value">{parseFloat(metrics.rmse).toFixed(4)}</div>
+              </div>
+            </div>
+          </div>
+        )}

-      {/* Grafik */}
-      {chartData.length > 0 ? (
-        <div style={{ marginTop: "40px" }}>
-          <h2>Grafik Prediksi vs Aktual</h2>
-          <ResponsiveContainer width="100%" height={400}>
-            <LineChart data={chartData}>
-              <CartesianGrid strokeDasharray="3 3" />
-              <XAxis dataKey="date" tick={false} /> {/* tanggal disembunyikan kalau panjang */}
-              <YAxis />
-              <Tooltip />
-              <Legend />
-              {chartData[0]?.actual !== null && (
-                <Line type="monotone" dataKey="actual" stroke="#8884d8" dot={false} name="Actual" />
-              )}
-              <Line type="monotone" dataKey="prediction" stroke="#82ca9d" dot={false} name="Prediction" />
-            </LineChart>
-          </ResponsiveContainer>
-        </div>
-      ) : (
-        <p style={{ marginTop: "20px" }}>Belum ada data prediksi.</p>
-      )}
-      {/* 🔹 Tambahan: Tabel Data Aktual vs Prediksi */}
-{chartData.length > 0 && (
-  <div style={{ marginTop: "40px" }}>
-    <h2>Tabel Data Aktual vs Prediksi</h2>
-    <table border="1" style={{ borderCollapse: "collapse", width: "100%", color: "white" }}>
-      <thead>
-        <tr>
-          <th>No</th>
-          <th>Tanggal</th>
-          <th>Actual</th>
-          <th>Prediction</th>
-        </tr>
-      </thead>
-      <tbody>
-        {chartData.slice(0, 50).map((row, i) => (
-          <tr key={i}>
-            <td>{i + 1}</td>
-            <td>{row.date}</td>
-            <td>{row.actual !== null ? row.actual.toFixed(3) : "-"}</td>
-            <td>{row.prediction.toFixed(3)}</td>
-          </tr>
-        ))}
-      </tbody>
-    </table>
-    <p style={{ marginTop: "10px" }}>*Hanya ditampilkan 50 data pertama.</p>
-  </div>
-)}
-    </div>
-      
+        {/* Grafik */}
+        {chartData.length > 0 ? (
+          <div className="chart-section">
+            <h2 className="section-title chart">Grafik Prediksi vs Aktual</h2>
+            <div className="chart-container">
+              <ResponsiveContainer width="100%" height={400}>
+                <LineChart data={chartData}>
+                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
+                  <XAxis 
+                    dataKey="date" 
+                    tick={false} 
+                    stroke="rgba(255,255,255,0.7)"
+                  />
+                  <YAxis stroke="rgba(255,255,255,0.7)" />
+                  <Tooltip 
+                    contentStyle={{
+                      backgroundColor: 'rgba(0,0,0,0.8)',
+                      border: '1px solid rgba(255,255,255,0.2)',
+                      borderRadius: '8px',
+                      color: 'white'
+                    }}
+                  />
+                  <Legend />
+                  {chartData[0]?.actual !== null && (
+                    <Line 
+                      type="monotone" 
+                      dataKey="actual" 
+                      stroke="#4facfe" 
+                      strokeWidth={3}
+                      dot={false} 
+                      name="Actual" 
+                    />
+                  )}
+                  <Line 
+                    type="monotone" 
+                    dataKey="prediction" 
+                    stroke="#00f2fe" 
+                    strokeWidth={3}
+                    dot={false} 
+                    name="Prediction" 
+                  />
+                </LineChart>
+              </ResponsiveContainer>
+            </div>
+          </div>
+        ) : (
+          !isLoading && (
+            <div className="no-data">
+              <p>📊 Belum ada data prediksi.</p>
+              <p>Silakan upload file CSV untuk melihat hasil prediksi.</p>
+            </div>
+          )
+        )}
+
+        {/* Tabel Data Aktual vs Prediksi */}
+        {chartData.length > 0 && (
+          <div className="table-section">
+            <h2 className="section-title table">Tabel Data Aktual vs Prediksi</h2>
+            <table className="data-table">
+              <thead>
+                <tr>
+                  <th>No</th>
+                  <th>Tanggal</th>
+                  <th>Actual</th>
+                  <th>Prediction</th>
+                </tr>
+              </thead>
+              <tbody>
+                {chartData.slice(0, 50).map((row, i) => (
+                  <tr key={i}>
+                    <td>{i + 1}</td>
+                    <td>{row.date}</td>
+                    <td>{row.actual !== null ? row.actual.toFixed(3) : "-"}</td>
+                    <td>{row.prediction.toFixed(3)}</td>
+                  </tr>
+                ))}
+              </tbody>
+            </table>
+            <p className="table-note">*Hanya ditampilkan 50 data pertama.</p>
+          </div>
+        )}
+      </div>
+    </div>
   );
 }

 export default App;