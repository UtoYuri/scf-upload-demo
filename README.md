# SCF-Upload-Demo
腾讯云无服务云函数，接收文件保存至COS。

## 使用
1. 重命名`config.example.js`为`config.js`并填写COS配置信息
2. 新建一个腾讯云无服务函数并上传项目代码

## API说明

#### HTTP请求方式
> POST

#### 请求参数
|参数|必选|类型|说明|
|:----- |:-------|:-----|----- |
|fileName |ture |string |文件名 |
|base64Data |true |string |base64编码的文件 |

#### 返回字段
|返回字段|字段类型|说明 |
|:----- |:------|:----------------------------- |
|errorCode |int |返回结果状态。0：正常；1：错误 |
|url |string |外网访问地址 |
|errorMessage |string | 错误信息 |