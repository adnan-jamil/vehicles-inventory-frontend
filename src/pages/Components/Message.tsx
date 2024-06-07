import Swal, { SweetAlertIcon } from 'sweetalert2';

export const showMessage = (
  msg: string = '',
  type: SweetAlertIcon = 'success'
) => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    background: 'rgb(59, 63, 92)',
    color: 'white',
    customClass: {
      container: 'custom-toast-container',
    },
  });

  toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px',
  });
};
