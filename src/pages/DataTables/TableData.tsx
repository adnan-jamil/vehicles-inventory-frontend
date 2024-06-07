import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';

const TableData = () => {
    const dispatch = useDispatch();
    const data = useSelector((state: IRootState) => state.inventory.inventoryStats);

    useEffect(() => {
        dispatch(setPageTitle('Basic Table'));

    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const recordsData = data?.slice(from, to) || [];

    return (
        <div>
            <div className="panel mt-6">
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'date', title: 'DATE' },
                            { accessor: 'newCount', title: 'NEW INVENTORY' },
                            { accessor: 'newTotalMSRP', title: 'NEW TOTAL MSRP' },
                            { accessor: 'newAverageMSRP', title: 'NEW AVERAGE MSRP' },
                            { accessor: 'usedCount', title: 'USED INVENTORY' },
                            { accessor: 'usedAverageMSRP', title: 'USED AVERAGE MSRP' },
                            { accessor: 'usedTotalMSRP', title: 'USED TOTAL MSRP' },
                            { accessor: 'cpoCount', title: 'CPO INVENTORY' },
                            { accessor: 'cpoTotalMSRP', title: 'CPO TOTAL MSRP' },
                            { accessor: 'cpoAverageMSRP', title: 'CPO AVERAGE MSRP' },
                        ]}
                        totalRecords={data?.length || 0}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `${from}-${to} of ${totalRecords}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default TableData
