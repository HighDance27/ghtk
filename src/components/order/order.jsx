import { Input, notification, Modal, InputNumber, Select, Form } from 'antd';
import { useState } from "react";
import { createOrderAPI } from "../../services/api.service";

const CreateOrder = (props) => {
    const [form] = Form.useForm();
    const { isCreateOpen, setIsCreateOpen,
        loadOrder } = props;

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleSubmitBtn = async (values) => {

        //step 2: create 
        const { note, return_name, return_address, return_province,
            return_district, return_ward,
            return_street, return_tel, return_email } = values;

        const resOrder = await createOrderAPI(
            note, return_name, return_address, return_province,
            return_district, return_ward,
            return_street, return_tel, return_email);

        if (resOrder.data) {
            resetAndCloseModal();
            await loadOrder();
            notification.success({
                message: "Create Order",
                description: "Order Created!"
            })

        } else {
            notification.error({
                message: "Error Creating Order!",
                description: JSON.stringify(resOrder.message)
            })
        }

    }
    const resetAndCloseModal = () => {
        form.resetFields();
        setSelectedFile(null);
        setPreview(null);
        setIsCreateOpen(false);
    }

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file))
        }
    }
    return (
        <Modal
            title="Create Order"
            open={isCreateOpen}
            onOk={() => form.submit()} //** */
            onCancel={() => resetAndCloseModal()}
            maskClosable={false}
            okText={"Mua"}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitBtn} //**** */
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        <Form.Item  //*********** */
                            label="Tên khách hàng"
                            name="return_name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Số nhà"
                            name="return_address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Tỉnh"
                            name="return_province"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Quận / Huyện"
                            name="return_district"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}>
                            <Input
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Ấp"
                            name="return_ward"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                },
                            ]}>
                            <Input
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Đường"
                            name="return_street"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                },
                            ]}>
                            <Input
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Số điện thoại"
                            name="return_tel"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}>
                            <Input
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Email"
                            name="return_email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}>
                            <Input
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Ghi chú"
                            name="note"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}>
                            <Input
                            />
                        </Form.Item>
                    </div>
                </div>
            </Form >
        </Modal>

    )
}
export default CreateOrder;