import React, { useState } from "react";
import getFileSHA256 from "@/utils/getFileSHA256";
import { Upload, Button, Table, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const ExcelImportTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  // 处理文件上传
  const handleUpload = async (file: File) => {
    const fileHash = await getFileSHA256(file);
    console.log(fileHash);

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      if (!binaryStr) return;

      try {
        // 读取 Excel
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // 默认取第一个工作表
        const sheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

        // 动态生成表头
        if (jsonData.length > 0) {
          const cols = Object.keys(jsonData[0]).map((key) => ({
            title: key,
            dataIndex: key,
            key,
          }));
          setColumns(cols);
        }

        setData(jsonData);
        message.success({
          content: "Excel 导入成功！",
          duration: 1,
          onClose: () => {
            console.log("first");
          },
        });
      } catch (err) {
        message.error("解析 Excel 失败！");
      }
    };
    reader.readAsBinaryString(file);

    // 阻止 antd 自动上传
    return false;
  };

  return (
    <div style={{ padding: 24 }}>
      <Upload beforeUpload={handleUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>上传 Excel 文件</Button>
      </Upload>

      <Table
        style={{ marginTop: 20 }}
        dataSource={data}
        columns={columns}
        rowKey={(record, index) => index!.toString()}
        bordered
      />
    </div>
  );
};

export default ExcelImportTable;
