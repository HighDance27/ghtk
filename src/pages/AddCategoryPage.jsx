import React, { useState } from 'react';
import { Layout, Typography, Form, Input, Button, Card, message, Alert } from 'antd';
import { createCategoryAPI } from '../services/api.service';
import './AddCategoryPage.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const AddCategoryPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);

    const handleSubmit = async (values) => {
        setLoading(true);
        setSuccess(false);
        setError(null);
        setApiResponse(null);

        try {
            const response = await createCategoryAPI(values);
            console.log('Phản hồi từ API:', response);
            setApiResponse(response.data);

            // Kiểm tra status từ response data hoặc HTTP status
            if (response.status === 201 || (response.data && (response.data.status === 201 || response.data.status === 200))) {
                message.success('Đã tạo danh mục sản phẩm thành công!');
                setSuccess(true);
                form.resetFields();
            } else {
                throw new Error(response.data?.message || 'Không thể tạo danh mục sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi khi tạo danh mục sản phẩm:', error);

            // Lấy thông báo lỗi từ response hoặc error object
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Không thể tạo danh mục sản phẩm. Vui lòng thử lại!';

            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="add-category-page">
            <Content className="add-category-content">
                <Title level={2}>Thêm Danh Mục Sản Phẩm Mới</Title>

                {success && (
                    <Alert
                        message="Tạo danh mục thành công"
                        description={
                            apiResponse?.data ?
                                `Danh mục "${apiResponse.data.name}" đã được tạo thành công với ID: ${apiResponse.data.id}` :
                                "Danh mục sản phẩm mới đã được tạo thành công trong hệ thống."
                        }
                        type="success"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {error && (
                    <Alert
                        message="Không thể tạo danh mục sản phẩm"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Card className="category-form-card">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="name"
                            label="Tên danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên danh mục'
                                }
                            ]}
                        >
                            <Input placeholder="Nhập tên danh mục sản phẩm" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả danh mục'
                                }
                            ]}
                        >
                            <TextArea
                                placeholder="Nhập mô tả chi tiết về danh mục sản phẩm"
                                rows={4}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="submit-button"
                            >
                                Tạo Danh Mục
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {apiResponse && (
                    <Card className="api-response-card" style={{ marginTop: 16 }}>
                        <Title level={4}>Phản hồi từ API</Title>
                        <pre className="api-response">
                            {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                    </Card>
                )}

                <Card className="api-info-card">
                    <Title level={4}>Thông tin API</Title>
                    <Text>
                        <pre>
                            {`POST /v1/api/categories
Yêu cầu:
{
  "name": "string",
  "description": "string"
}
Phản hồi:
{
  "status": 201,
  "message": "Tạo danh mục thành công",
  "data": {
    "id": int64,
    "name": "string",
    "description": "string",
    "products": []
  }
}`}
                        </pre>
                    </Text>
                </Card>
            </Content>
        </Layout>
    );
};

export default AddCategoryPage; 