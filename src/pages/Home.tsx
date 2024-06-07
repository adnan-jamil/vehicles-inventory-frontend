
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import Header from '../components/Layouts/Header';
import TableData from './DataTables/TableData';
import { setPageTitle } from '../store/themeConfigSlice';
import Select, { StylesConfig } from 'react-select';
import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import API_ENDPOINTS from '../components/ApiRoutes/routes';
import { showMessage } from './Components/Message';
import { Loader } from './Components/Loader';
import { setInventoryData } from '../store/inventorySlice';
interface OptionType {
    value: string;
    label: string;
}
interface SelectedItems {
    [key: string]: boolean;
}

interface InventoryItem {
    count: number;
    totalMSRP: number;
    condition: 'new' | 'used' | 'cpo'; // Assuming 'condition' can be one of these values
    averageMSRP: number;
}
const Home = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [vehicleStats, setVehicleStats] = useState<InventoryItem[]>([]);
    const [brandData, setBrandData] = useState([]);
    //IntentoryGraph
    const [newVehicleCounts, setnewVehicleCounts] = useState([]);
    const [newVehicleCountsDate, setnewVehicleCountsDate] = useState([]);
    const [usedVehicleCounts, setusedVehicleCounts] = useState([]);
    const [usedVehicleCountsDate, setusedVehicleCountsDate] = useState([]);
    const [cpoVehicleCounts, setcpoVehicleCounts] = useState([]);
    const [cpoVehicleCountsDate, setcpoVehicleCountsDate] = useState([]);
    //AverageGraph
    const [newVehicleAverageMSRP, setnewVehicleAverageMSRP] = useState([]);
    const [newVehicleAverageMSRPDate, setnewVehicleAverageMSRPDate] = useState([]);
    const [usedVehicleAverageMSRP, setusedVehicleAverageMSRP] = useState([]);
    const [usedVehicleAverageMSRPDate, setusedVehicleAverageMSRPDate] = useState([]);
    const [cpoVehicleAverageMSRP, setcpoVehicleAverageMSRP] = useState([]);
    const [cpoVehicleAverageMSRPDate, setcpoVehicleAverageMSRPDate] = useState([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedItemDuration, setSelectedItemDuration] = useState<string | null>(null);
    const dropdownRef: any = useRef(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        dispatch(setPageTitle('POS'));
    });

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const itemName = event.target.name;
        setSelectedItem(itemName === selectedItem ? null : itemName);
    };
    const handleCheckboxChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
        const itemName = event.target.name;
        setSelectedItemDuration(itemName === selectedItemDuration ? null : itemName);
    };


    const handleRemoveAllFilters = () => {
        setSelectedItem(null);
        setSelectedItemDuration(null);
        getInventoryData();
    };

    const getInventoryData = () => {
        setIsLoading(true)
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_ENDPOINTS.GetInventory, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    const data = result?.data
                    setVehicleStats(data?.vehicleStats)
                    setIsLoading(false)

                    //Inventory-Count-Graph
                    //New
                    const getCountArray = data?.newVehicleCounts?.map((item: any) => item?.counts)
                    setnewVehicleCounts(getCountArray)
                    const getCountDateArray = data?.newVehicleCounts?.map((item: any) => item.date)
                    setnewVehicleCountsDate(getCountDateArray)

                    //used
                    const getCountArrayNew = data?.usedVehicleCounts?.map((item: any) => item?.counts)
                    setusedVehicleCounts(getCountArrayNew)
                    const getCountDateArrayNew = data?.usedVehicleCounts?.map((item: any) => item.date)
                    setusedVehicleCountsDate(getCountDateArrayNew)

                    //CPO
                    const getCountArrayCpo = data?.cpoVehicleCounts?.map((item: any) => item?.counts)
                    // console.log('getCountArrayCpo', getCountArrayCpo)
                    setcpoVehicleCounts(getCountArrayCpo)
                    const getCountDateArrayCpo = data?.cpoVehicleCounts?.map((item: any) => item.date)
                    setcpoVehicleCountsDate(getCountDateArrayCpo)



                    //Average-Count-Graph
                    //New
                    const getAvgArray = data?.newVehicleAverageMSRP?.map((item: any) => item.averageMSRP)
                    setnewVehicleAverageMSRP(getAvgArray)
                    const getDateArray = data?.newVehicleAverageMSRP?.map((item: any) => item.date)
                    setnewVehicleAverageMSRPDate(getDateArray)

                    //used
                    const getAvgArrayNew = data?.usedVehicleAverageMSRP?.map((item: any) => item.averageMSRP)
                    setusedVehicleAverageMSRP(getAvgArrayNew)
                    const getDateArrayNew = data?.usedVehicleAverageMSRP?.map((item: any) => item?.date)
                    setusedVehicleAverageMSRPDate(getDateArrayNew)

                    //CPO
                    const getAvgArrayCpo = data?.cpoVehicleAverageMSRP?.map((item: any) => item?.averageMSRP)
                    setcpoVehicleAverageMSRP(getAvgArrayCpo)
                    const getDateArrayCpoDate = data?.cpoVehicleAverageMSRP?.map((item: any) => item?.date)
                    // console.log('getDateArrayCpoDATE', getDateArrayCpoDate)
                    setcpoVehicleAverageMSRPDate(getDateArrayCpoDate)


                    //DataTable
                    // setinventoryStats(data?.inventoryStats)
                    dispatch(setInventoryData(result.data.inventoryStats));

                } else {
                    setIsLoading(false)
                    showMessage(result?.message)

                }
            })
            .catch((error) => {
                showMessage(error?.message)
                console.error(error)
            });
    }
    const GetFilteredData = () => {
        setIsLoading(true)

        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow"
        };

        let url = ''

        if (selectedItem && selectedItemDuration) {
            url = `${API_ENDPOINTS.GetFIlterData}?date=${selectedItemDuration}&brand=${selectedItem}`
        }
        if (selectedItem) {
            url = `${API_ENDPOINTS.GetFIlterData}?brand=${selectedItem}`
        } else if (selectedItemDuration) {
            url = `${API_ENDPOINTS.GetFIlterData}?date=${selectedItemDuration}`
        }

        console.log('url', url)

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    const data = result?.data
                    console.log('FilteredData===>', data)
                    //cardsData
                    setVehicleStats(data?.vehicleStats)

                    //Inventory-Count-Graph
                    //New
                    const getCountArray = data?.newVehicleCounts?.map((item: any) => item?.counts)
                    setnewVehicleCounts(getCountArray)
                    const getCountDateArray = data?.newVehicleCounts?.map((item: any) => item.date)
                    setnewVehicleCountsDate(getCountDateArray)

                    //used
                    const getCountArrayNew = data?.usedVehicleCounts?.map((item: any) => item?.counts)
                    setusedVehicleCounts(getCountArrayNew)
                    const getCountDateArrayNew = data?.usedVehicleCounts?.map((item: any) => item.date)
                    setusedVehicleCountsDate(getCountDateArrayNew)

                    //CPO
                    const getCountArrayCpo = data?.cpoVehicleCounts?.map((item: any) => item?.counts)
                    // console.log('getCountArrayCpo', getCountArrayCpo)
                    setcpoVehicleCounts(getCountArrayCpo)
                    const getCountDateArrayCpo = data?.cpoVehicleCounts?.map((item: any) => item.date)
                    setcpoVehicleCountsDate(getCountDateArrayCpo)



                    //Average-Count-Graph
                    //New
                    const getAvgArray = data?.newVehicleAverageMSRP?.map((item: any) => item.averageMSRP)
                    setnewVehicleAverageMSRP(getAvgArray)
                    const getDateArray = data?.newVehicleAverageMSRP?.map((item: any) => item.date)
                    setnewVehicleAverageMSRPDate(getDateArray)

                    //used
                    const getAvgArrayNew = data?.usedVehicleAverageMSRP?.map((item: any) => item.averageMSRP)
                    setusedVehicleAverageMSRP(getAvgArrayNew)
                    const getDateArrayNew = data?.usedVehicleAverageMSRP?.map((item: any) => item?.date)
                    setusedVehicleAverageMSRPDate(getDateArrayNew)

                    //CPO
                    const getAvgArrayCpo = data?.cpoVehicleAverageMSRP?.map((item: any) => item?.averageMSRP)
                    setcpoVehicleAverageMSRP(getAvgArrayCpo)
                    const getDateArrayCpoDate = data?.cpoVehicleAverageMSRP?.map((item: any) => item?.date)
                    // console.log('getDateArrayCpoDATE', getDateArrayCpoDate)
                    setcpoVehicleAverageMSRPDate(getDateArrayCpoDate)

                    setIsLoading(false)




                    //DataTable
                    // setinventoryStats(data?.inventoryStats)
                    dispatch(setInventoryData(result.data.inventoryStats));

                } else {
                    setIsLoading(false)
                    showMessage(result?.message)

                }
            })
            .catch((error) => {
                setIsLoading(false)
                showMessage(error?.message)
                console.error(error)
            });
    }


    const GetBrands = () => {
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_ENDPOINTS.GetBrands, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    const brand = result?.data?.brandsData
                    setBrandData(brand)
                } else {
                    showMessage(result?.message)
                }
            })
            .catch((error) => {
                showMessage(error?.message)
                console.error(error)
            });
    }
    useEffect(() => {
        getInventoryData()
        GetBrands()
    }, [])

    //Inventory-Count
    const InventoryCountNew: any = {
        series: [
            {
                name: 'Direct',
                data: newVehicleCounts
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#FF9926'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 0,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: newVehicleCountsDate,
                axisBorder: {
                    show: true,
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                // opposite: isRtl ? true : false,
                labels: {
                    // offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: '',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };
    const InventoryCountUsed: any = {
        series: [
            {
                name: 'Direct',
                data: usedVehicleCounts
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#FF9926'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 0,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: usedVehicleCountsDate,
                axisBorder: {
                    show: true,
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                // opposite: isRtl ? true : false,
                labels: {
                    // offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: '',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };
    const InventoryCountCPO: any = {
        series: [
            {
                name: 'Direct',
                data: cpoVehicleCounts
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#FF9926'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 0,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: cpoVehicleCountsDate,
                axisBorder: {
                    show: true,
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                // opposite: isRtl ? true : false,
                labels: {
                    // offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: '',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };

    //Average-Count
    const AverageCountNew: any = {
        series: [
            {
                name: 'Direct',
                data: newVehicleAverageMSRP
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#FF9926'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 0,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: newVehicleAverageMSRPDate,
                axisBorder: {
                    show: true,
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                // opposite: isRtl ? true : false,
                labels: {
                    // offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: '',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };
    const AverageCountUsed: any = {
        series: [
            {
                name: 'Direct',
                data: usedVehicleAverageMSRP
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#FF9926'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 0,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: usedVehicleAverageMSRPDate,
                axisBorder: {
                    show: true,
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                // opposite: isRtl ? true : false,
                labels: {
                    // offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: '',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };
    const AverageCountCpo: any = {
        series: [
            {
                name: 'Direct',
                data: cpoVehicleAverageMSRP
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#FF9926'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 0,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: cpoVehicleAverageMSRPDate,
                axisBorder: {
                    show: true,
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                // opposite: isRtl ? true : false,
                labels: {
                    // offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: '',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };


    const options = [
        { value: 'AA MITSUBISHI DEALER', label: 'AA MITSUBISHI DEALER' },
        { value: 'AA COLORA DEALER', label: 'AA COLORA DEALER' },
        { value: 'AA KIA DEALER', label: 'AA KIA DEALER' },
    ];
    const customStyles: StylesConfig<OptionType> = {
        container: (provided) => ({
            ...provided,
            width: '300px', // Set the desired width here
        }),
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#F59322' : provided.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #F59322' : provided.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? '#F59322' : provided.borderColor,
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#F59322' : provided.backgroundColor, // Change background color of selected option to orange
            color: state.isSelected ? 'white' : provided.color, // Change text color of selected option to white
        }),
    };
    const items2 = ['Last Month', 'This Month', 'Last 3 Months', 'Last 6 Months', 'This Year', 'Last Year'];
    return (
        <>
            {isLoading && <div className="loaderScreen"><Loader /></div>}

            <Header />
            <div className='md:px-16 px-5 py-9 pt-24 bg-[#F5F5F5]'>

                <div className="relative flex flex-wrap items-center justify-between">
                    <div className='text-black text-[34px] font-semibold leading-normal'>
                        Inventory
                    </div>
                    <div className='flex items-center flex-wrap  gap-5'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            <h1 className='text-black text-base font-semibold leading-normal'>
                                Select Dealer
                            </h1>
                            <Select defaultValue={options[0]} options={options} isSearchable={false} styles={customStyles} />
                        </div>
                        <div onClick={() => setOpen(!open)} className='flex items-center  gap-3 bg-white rounded-[4px] px-4 py-3 cursor-pointer'>

                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12" viewBox="0 0 17 12" fill="none">
                                    <path d="M10.3889 12H6.61111V10H10.3889V12ZM17 0V2H0V0H17ZM14.1667 7H2.83333V5H14.1667V7Z" fill="#F59322" />
                                </svg>
                            </div>

                            <div className=' text-black-customBlack text-sm font-semibold uppercase leading-normal '>
                                Filter Data By
                            </div>
                        </div>
                    </div>


                </div>
                {open && (
                    <div className="md:w-[486px] fixed h-[calc(100svh-76px)] max-md:w-[70%] max-sm:w-[90%] rounded-l-lg w-full flex flex-col transition-all duration-500 delay-500 top-[76px] right-0 z-50 bg-[#FFF]" ref={dropdownRef}>
                        <div className="h-full flex flex-col gap-[25px] p-8 overflow-y-scroll">
                            <div className="flex items-center gap-4">
                                <IoIosArrowBack className="text-[#757575] text-lg cursor-pointer" onClick={() => setOpen(!open)} />
                                <div className="font-sans md:text-[34px] text-[24px] font-medium">Filter Data By</div>
                            </div>
                            <hr />
                            <div>
                                <div className="text-[14px] font-bold py-2">Make</div>
                                {brandData?.map((item) => (
                                    <div key={item} className="mb-2 ml-1 items-center py-1">
                                        <label className="inline-flex font-medium items-center">
                                            <input
                                                type="checkbox"
                                                name={item}
                                                checked={selectedItem === item}
                                                onChange={handleCheckboxChange}
                                                className="form-checkbox"
                                            />
                                            <span className="ml-2">{item}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            <div>
                                <div className="text-[14px] font-bold py-2">Duration</div>
                                {items2?.map((item) => (
                                    <div key={item} className="mb-2 ml-1 py-1">
                                        <label className="inline-flex font-medium items-center">
                                            <input
                                                type="checkbox"
                                                name={item}
                                                checked={selectedItemDuration === item}
                                                onChange={handleCheckboxChangeDuration}
                                                className="form-checkbox"
                                            />
                                            <span className="ml-2">{item}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            {(selectedItem || selectedItemDuration) &&
                                <div className="w-full flex gap-1  pb-10">
                                    <div onClick={() => GetFilteredData()} className="md:w-[60%] w-[40%] bg-[#F59322] items-center rounded-md cursor-pointer justify-center">
                                        <button className=" py-2 w-full  text-white items-center h-full text-sm rounded-md ">Apply Filter</button>
                                    </div>
                                    <div className="md:w-[40%] w-[60%] flex  justify-center gap-2 cursor-pointer    items-center  border  rounded-md border-[#F59322]">
                                        <MdCancel className="text-lg text-[#F59322]" />
                                        <button className="w-fit text-[#F59322] text-sm h-full px-1 py-2 rounded-md" onClick={handleRemoveAllFilters}>
                                            Remove All Filters
                                        </button>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                )}
                <hr className="border-t border-gray-300 my-4" />

                <div className="pt-5">
                    <p className=' text-black-customBlack text-base font-bold pb-6 leading-normal '>
                        Recent Gathered Data 04/01/24
                    </p>
                    <div className="grid sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 mb-6">
                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>{vehicleStats[2]?.count ? vehicleStats[2]?.count : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'># New Units</p>
                        </div>

                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>${vehicleStats[2]?.totalMSRP ? vehicleStats[2]?.totalMSRP : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'>New MSRP</p>
                        </div>

                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>${vehicleStats[2]?.averageMSRP ? vehicleStats[2]?.averageMSRP : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'>New Avg. MSRP</p>
                        </div>

                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>{vehicleStats[1]?.count ? vehicleStats[1]?.count : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'># Used Units</p>
                        </div>

                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>${vehicleStats[1]?.totalMSRP ? vehicleStats[1]?.totalMSRP : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'>Used MSRP</p>
                        </div>

                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>${vehicleStats[1]?.averageMSRP ? vehicleStats[1]?.averageMSRP : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'>Used Avg. MSRP</p>
                        </div>

                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>{vehicleStats[0]?.count ? vehicleStats[0]?.count : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'># CPO Units</p>
                        </div>

                        <div className="panel h-full sm:col-span-2 2xl:col-span-1">
                            <div className="flex justify-between dark:text-white-light mb-1">
                                <h5 className='text-black text-2xl font-bold leading-normal'>${vehicleStats[0]?.averageMSRP ? vehicleStats[0]?.averageMSRP : 0}</h5>
                            </div>
                            <p className='text-primary-light text-base font-bold leading-normal'>CPO MSRP</p>
                        </div>
                    </div>


                    <div className="grid lg:grid-cols-1 mb-6">
                        <div className="panel h-full p-0 lg:col-span-2 shadow-[0px] bg-[#f5f5f5]">

                            <div className="px-[10px] bg-[#f5f5f5]">
                                <Tab.Group >
                                    <Tab.List className="mt-3 flex flex-wrap items-center ">
                                        <p className="text-base font-bold text-[#000000DE] pe-[20px]">Inventory Count</p>
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${selected ? 'bg-primary text-white !outline-none' : 'bg-white border border-solid border-primary'}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2 `}
                                                >
                                                    New
                                                </button>
                                            )}
                                        </Tab>
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${selected ? 'bg-primary text-white !outline-none' : 'bg-white border border-solid border-primary'}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}
                                                >
                                                    USED
                                                </button>
                                            )}
                                        </Tab>
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${selected ? 'bg-primary text-white !outline-none' : 'bg-white border border-solid border-primary'}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}
                                                >
                                                    CPO
                                                </button>
                                            )}
                                        </Tab>
                                    </Tab.List>
                                    <Tab.Panels>
                                        <Tab.Panel className={"bg-white mt-[25px] rounded-[5px]"}>
                                            <ReactApexChart options={InventoryCountNew.options} series={InventoryCountNew.series} type="bar" height={360} className="overflow-hidden" />
                                        </Tab.Panel>
                                        <Tab.Panel className={"bg-white mt-[25px] rounded-[5px]"}>
                                            <ReactApexChart options={InventoryCountUsed.options} series={InventoryCountUsed.series} type="bar" height={360} className="overflow-hidden" />
                                        </Tab.Panel>
                                        <Tab.Panel className={"bg-white mt-[25px] rounded-[5px]"} >
                                            <ReactApexChart options={InventoryCountCPO.options} series={InventoryCountCPO.series} type="bar" height={360} className="overflow-hidden" />
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        </div>

                    </div>

                    <div className="grid lg:grid-cols-1 mb-6">
                        <div className="panel h-full p-0 lg:col-span-2 shadow-[0px] bg-[#f5f5f5]">

                            <div className="mb-5 px-[10px] bg-[#f5f5f5]">
                                <Tab.Group >
                                    <Tab.List className="mt-3 flex flex-wrap items-center ">
                                        <p className="text-base font-bold text-[#000000DE] pe-[20px]">Average MSRP in USD</p>
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${selected ? 'bg-primary text-white !outline-none' : 'bg-white border border-solid border-primary'}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2 `}
                                                >
                                                    New
                                                </button>
                                            )}
                                        </Tab>
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${selected ? 'bg-primary text-white !outline-none' : 'bg-white border border-solid border-primary'}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}
                                                >
                                                    USED
                                                </button>
                                            )}
                                        </Tab>
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${selected ? 'bg-primary text-white !outline-none' : 'bg-white border border-solid border-primary'}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}
                                                >
                                                    CPO
                                                </button>
                                            )}
                                        </Tab>
                                    </Tab.List>
                                    <Tab.Panels>
                                        <Tab.Panel className={"bg-white mt-[25px] rounded-[5px]"}>
                                            <ReactApexChart options={AverageCountNew.options} series={AverageCountNew.series} type="bar" height={360} className="overflow-hidden" />
                                        </Tab.Panel>
                                        <Tab.Panel className={"bg-white mt-[25px] rounded-[5px]"}>
                                            <ReactApexChart options={AverageCountUsed.options} series={AverageCountUsed.series} type="bar" height={360} className="overflow-hidden" />
                                        </Tab.Panel>
                                        <Tab.Panel className={"bg-white mt-[25px] rounded-[5px]"} >
                                            <ReactApexChart options={AverageCountCpo.options} series={AverageCountCpo.series} type="bar" height={360} className="overflow-hidden" />
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        </div>

                    </div>


                    <div className="grid grid-cols-1">
                        <TableData />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
