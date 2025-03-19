import React, { useEffect, useState } from "react";
import { Result, Button, Layout, Card, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { CloseCircleOutlined, ShoppingCartOutlined, HomeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./PaymentFailedPage.css";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const PaymentFailedPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [errorCode, setErrorCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Lấy thông tin lỗi từ URL (nếu có)
        const params = new URLSearchParams(location.search);
        const vnpResponseCode = params.get('vnp_ResponseCode');
        const vnpMessage = params.get('vnp_Message');

        if (vnpResponseCode) {
            setErrorCode(vnpResponseCode);
        }

        if (vnpMessage) {
            setErrorMessage(vnpMessage);
        }
    }, [location]);

    // Hàm để hiển thị mô tả lỗi dựa trên mã lỗi
    const getErrorDescription = (code) => {
        const errorCodes = {
            '01': 'Giao dịch đã tồn tại',
            '02': 'Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)',
            '03': 'Dữ liệu gửi sang không đúng định dạng',
            '04': 'Khởi tạo GD không thành công do Website đang bị tạm khóa',
            '05': 'Giao dịch không thành công do: URL thanh toán hoặc mã Merchant không đúng',
            '06': 'Giao dịch không thành công do sai mật khẩu thanh toán',
            '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
            '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking',
            '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán',
            '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
            '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
            '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
            '75': 'Ngân hàng thanh toán đang bảo trì',
            '99': 'Lỗi không xác định'
        };

        return errorCodes[code] || 'Lỗi không xác định';
    };

    return (
        <Layout className="payment-failed-page">
            <Content className="payment-failed-content">
                <Result
                    status="error"
                    title="Thanh toán thất bại"
                    subTitle="Rất tiếc, quá trình thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
                    icon={<CloseCircleOutlined style={{ color: "#f5222d" }} />}
                    extra={[
                        <Button
                            type="primary"
                            key="cart"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => navigate("/cart")}
                        >
                            Quay lại giỏ hàng
                        </Button>,
                        <Button
                            key="home"
                            icon={<HomeOutlined />}
                            onClick={() => navigate("/")}
                        >
                            Trang chủ
                        </Button>,
                    ]}
                />

                {errorCode && (
                    <Card className="error-details" title={<><InfoCircleOutlined /> Chi tiết lỗi</>}>
                        <Paragraph>
                            <Text strong>Mã lỗi:</Text> {errorCode}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Mô tả:</Text> {getErrorDescription(errorCode)}
                        </Paragraph>
                        {errorMessage && (
                            <Paragraph>
                                <Text strong>Thông báo:</Text> {errorMessage}
                            </Paragraph>
                        )}
                    </Card>
                )}

                <div className="payment-failed-reason">
                    <Title level={5}>Lý do có thể xảy ra:</Title>
                    <ul>
                        <li>Tài khoản không đủ số dư</li>
                        <li>Thẻ của bạn không được kích hoạt thanh toán trực tuyến</li>
                        <li>Lỗi từ cổng thanh toán VNPay</li>
                        <li>Thời gian thanh toán quá lâu</li>
                        <li>Thông tin thanh toán không chính xác</li>
                    </ul>
                </div>

                <div className="payment-failed-support">
                    <Title level={5}>Bạn cần hỗ trợ?</Title>
                    <Paragraph>
                        Vui lòng liên hệ với chúng tôi qua số điện thoại: <Text strong>1900 1234</Text> hoặc email: <Text strong>support@myshop.com</Text>
                    </Paragraph>
                    <Paragraph>
                        Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ bạn giải quyết vấn đề từ 8:00 - 22:00 mỗi ngày.
                    </Paragraph>
                </div>
            </Content>
        </Layout>
    );
};

export default PaymentFailedPage; 