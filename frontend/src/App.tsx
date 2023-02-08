import React, { useState } from "react";
import axios from "axios";
import "./App.css";

interface logResFile {
  timestamp: number;
  loglevel: string;
  transactionId: string;
  err: string;
}
const App = () => {
  const [logFile, setLogFile] = useState<File>();
  const [resData, setResData] = useState<logResFile | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("logFile", logFile!);

      const response = await axios.post(
        "http://localhost:3001/logs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setResData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  function exportUserInfo(logInfo: logResFile) {
    const fileData = JSON.stringify(logInfo);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "log-info.json";
    link.href = url;
    link.click();
  }

  exportUserInfo(resData);
  return (
    <>
      <div className="App">
        <h1>Upload file</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="file" onChange={handleChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default App;
