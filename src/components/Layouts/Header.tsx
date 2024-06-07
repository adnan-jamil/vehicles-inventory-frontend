import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import headerLogo from '../../../public/assets/images/headerIcon.png';

import Support from '../Icon/Support';

const Header = () => {
    const location = useLocation();
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);


    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();



    const { t } = useTranslation();

    return (
        <header className={`z-40 fixed left-0 top-0 right-0`}>
            <div className="shadow-sm">
                <div className="relative bg-secondary flex flex-wrap !justify-between w-full items-center px-5 py-2.5 dark:bg-black">


                    <ul className="flex items-center space-x-2 dark:text-[#d0d2d6]">
                        <li>
                            <div >
                                <img src={headerLogo} alt='headerLogo' />
                            </div>
                        </li>
                        <li>
                            <div className='text-white text-xl font-medium leading-normal '>
                                Admin Console
                            </div>
                        </li>

                    </ul>

                    <div className="flex items-center">
                        <div>
                            <ul className="flex items-center gap-3">
                                <li>
                                    <div >
                                        <Support />
                                    </div>
                                </li>
                                <li>
                                    <div className='text-white text-base font-normal leading-normal pe-3 '>
                                        Support
                                    </div>
                                </li>

                            </ul>
                        </div>
                        <div className="dropdown shrink-0 flex items-center gap-5 bg-black-customBlack2 rounded-md p-[10px]">
                            <Dropdown
                                offset={[0, 8]}
                                placement={'bottom-end'}
                                btnClassName="relative group block w-full" // Ensure the button takes full width of the div
                                button={
                                    <div className="flex items-center w-full gap-5">
                                        <img className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />
                                        <div className='text-white text-base font-normal leading-normal'>
                                            Jade
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                            <path d="M5.75 9.58172L7.10125 8.23047L11.5 12.6196L15.8988 8.23047L17.25 9.58172L11.5 15.3317L5.75 9.58172Z" fill="#FF9926" />
                                        </svg>
                                    </div>
                                }
                            >
                                <ul className="text-dark !bg-black dark:text-white-dark !py-0 w-[140px] font-semibold dark:text-white-light/90">
                                    <li>
                                        <Link to="#" className="text-white">
                                            Accounts
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
