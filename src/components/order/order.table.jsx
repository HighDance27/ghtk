import { DeleteOutlined, EditOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import ViewOrderDetail from './order.detail';
import { fetchAllProductAPI } from '../../services/api.service';
import CreateOrder from './order';


const OrderTable = (props) => {
    const [dataOrder, setDataOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [dataDetail, setDataDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);


    const loadOrder = useCallback(async () => {

        setLoadingTable(true)
        const res = await fetchAllProductAPI();
        if (res.data) {
            setDataOrder(res.data);
            // setCurrent(res.data.meta.current);
            // setPageSize(res.data.meta.pageSize);
            // setTotal(res.data.meta.total);
        }
        setLoadingTable(false)
    }, [current, pageSize]
    )
    useEffect(() => {
        loadOrder();
    }, [loadOrder])

    // const handleDeleteOrder = async (id) => {
    //     const res = await deleteOrderAPI(id);
    //     if (res.data) {
    //         notification.success({
    //             message: "Delete Order",
    //             description: `Đã xóa thành công`
    //         });
    //         await loadOrder();
    //     } else {
    //         notification.error({
    //             message: "Error Deleting Order",
    //             description: JSON.stringify(res.message)
    //         });
    //     }
    // }
    // const onChange = (pagination, filters, sorter, extra) => {
    //     //neu thay doi trang: current
    //     if (pagination && pagination.current) {
    //         if (+pagination.current !== +current) {
    //             setCurrent(+pagination.current)
    //         }
    //     }
    //     //neu thay doi tong so phan tu: pageSize
    //     if (pagination && pagination.pageSize) {
    //         if (+pagination.pageSize !== +pageSize) {
    //             setPageSize(+pagination.pageSize)
    //         }
    //     }
    // };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (_, record) => {
                return (
                    <a
                        href='#'
                        onClick={() => {
                            setDataDetail(record);
                            setIsDetailOpen(true);
                        }}
                    >{record.id}</a>
                )
            }
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (text) => {
                if (text) {
                    return (
                        <span style={{
                            color: "green",
                            fontWeight: "bold",
                            fontSize: "14px"
                        }}>
                            {new Intl.NumberFormat('vi-VN', {
                                style: "currency",
                                currency: "VND"
                            }).format(text)}
                        </span>
                    );
                }
                return null;
            },
        },

        {
            title: 'Khối lượng',
            dataIndex: 'weight',
            render: (text) => `${text}kg`,
        },

        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (text, record) => {
                return (
                    <img
                        src={record.image}
                        alt={record.name}
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }}
                    />
                );
            },
        },


        {
            title: 'Số lượng trong kho',
            dataIndex: 'inventory',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px", fontSize: "20px" }}>
                    <EditOutlined
                        onClick={() => {
                            setDataUpdate(record);
                            setIsModalUpdateOpen(true);
                        }}
                        style={{ cursor: "pointer", color: "orange" }} />
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có muốn xóa sản phẩm này?"
                        onConfirm={() => handleDeleteOrder(record._id)}
                        okText="Yes"
                        cancelText="No"
                        placement='left'
                    >
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                    </Popconfirm>
                    <ShoppingCartOutlined
                        onClick={() => setIsCreateOpen(true)}
                        type="primary"
                        style={{ cursor: "pointer" }} />
                </div >
            ),
        },
    ];

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center"

            }}>
                <h3>Demo Product</h3>
            </div>
            <Table columns={columns}
                dataSource={dataOrder}
                rowKey={"_id"}


                loading={loadingTable}
            />
            <ViewOrderDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
            />
            <CreateOrder
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
                loadOrder={loadOrder}
            />
        </>
    )
}
export default OrderTable;