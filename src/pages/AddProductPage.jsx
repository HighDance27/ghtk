import React, { useState, useEffect } from 'react';
import { Layout, Typography, Form, Input, Button, Card, message, Alert, InputNumber, Select } from 'antd';
import { createProductAPI, getAllCategoriesAPI } from '../services/api.service';
import './AddCategoryPage.css'; // Sử dụng lại CSS của AddCategoryPage

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AddProductPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await getAllCategoriesAPI();
                console.log('Response from API:', response);

                // Dựa vào console, dữ liệu trả về có cấu trúc khác
                // data.content là một mảng chứa các danh mục
                if (response && response.data) {
                    // Trích xuất mảng danh mục từ phản hồi
                    if (response.data.data && Array.isArray(response.data.data.content)) {
                        // Trường hợp response.data.data.content
                        setCategories(response.data.data.content);
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        // Trường hợp response.data.data là mảng
                        setCategories(response.data.data);
                    } else if (response.data.content && Array.isArray(response.data.content)) {
                        // Trường hợp response.data.content
                        setCategories(response.data.content);
                    } else if (Array.isArray(response.data)) {
                        // Trường hợp response.data là mảng
                        setCategories(response.data);
                    }

                    console.log('Categories loaded:', categories);
                }
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
                message.error('Không thể tải danh sách danh mục. Vui lòng thử lại!');
            }
        };

        loadCategories();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        setSuccess(false);
        setError(null);
        setApiResponse(null);

        // Xử lý hình ảnh (trong ứng dụng thực tế, bạn sẽ cần upload ảnh lên server)
        // Ở đây chúng ta giả định rằng người dùng đã nhập URL hình ảnh
        const productData = {
            name: values.name,
            price: values.price,
            weight: values.weight,
            image: values.image,
            inventory: values.inventory,
            category_id: values.category_id
        };

        try {
            const response = await createProductAPI(productData);
            console.log('Phản hồi từ API:', response);
            setApiResponse(response.data);

            // Kiểm tra status từ response data hoặc HTTP status
            if (response.status === 201 || (response.data && (response.data.status === 201 || response.data.status === 200))) {
                message.success('Đã tạo sản phẩm mới thành công!');
                setSuccess(true);
                form.resetFields();
            } else {
                throw new Error(response.data?.message || 'Không thể tạo sản phẩm mới');
            }
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm mới:', error);

            // Lấy thông báo lỗi từ response hoặc error object
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Không thể tạo sản phẩm mới. Vui lòng thử lại!';

            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="add-category-page">
            <Content className="add-category-content">
                <Title level={2}>Thêm Sản Phẩm Mới</Title>

                {success && (
                    <Alert
                        message="Tạo sản phẩm thành công"
                        description={
                            apiResponse?.data ?
                                `Sản phẩm "${apiResponse.data.name}" đã được tạo thành công với ID: ${apiResponse.data.id}` :
                                "Sản phẩm mới đã được tạo thành công trong hệ thống."
                        }
                        type="success"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {error && (
                    <Alert
                        message="Không thể tạo sản phẩm mới"
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
                            label="Tên sản phẩm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm'
                                }
                            ]}
                        >
                            <Input placeholder="Nhập tên sản phẩm" />
                        </Form.Item>

                        <Form.Item
                            name="category_id"
                            label="Danh mục sản phẩm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục sản phẩm'
                                }
                            ]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map((category) => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Giá sản phẩm (VNĐ)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá sản phẩm'
                                }
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="Nhập giá sản phẩm"
                            />
                        </Form.Item>

                        <Form.Item
                            name="weight"
                            label="Khối lượng (kg)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập khối lượng sản phẩm'
                                }
                            ]}
                        >
                            <InputNumber
                                min={0}
                                step={0.1}
                                style={{ width: '100%' }}
                                placeholder="Nhập khối lượng sản phẩm"
                            />
                        </Form.Item>

                        <Form.Item
                            name="inventory"
                            label="Số lượng trong kho"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng sản phẩm'
                                }
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Nhập số lượng sản phẩm"
                            />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Đường dẫn hình ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đường dẫn hình ảnh'
                                }
                            ]}
                        >
                            <Input placeholder="Nhập đường dẫn hình ảnh sản phẩm" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="submit-button"
                            >
                                Tạo Sản Phẩm
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
                            {`POST /v1/api/products
Yêu cầu:
{
  "name": "string",
  "price": number,
  "weight": number,
  "image": "string",
  "inventory": number,
  "category_id": number
}
Phản hồi:
{
  "status": 201,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "id": int64,
    "name": "string",
    "price": number,
    "weight": number,
    "image": "string",
    "inventory": number,
    "category": {
      "id": int64,
      "name": "string"
    }
  }
}`}
                        </pre>
                    </Text>
                </Card>
            </Content>
        </Layout>
    );
};

export default AddProductPage; 