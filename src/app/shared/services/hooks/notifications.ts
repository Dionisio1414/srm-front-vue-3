import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

type CustomError = {
  response: {
    status: number;
    data: { message: string; errors: string[][] };
  };
  code?: string;
};
type OnSuccess = (message: string, callback?: () => void) => void;
type OnError = (error: CustomError, callback?: (error: CustomError) => void) => void;
type OnCustomError = (error: CustomError, callback?: (error: CustomError) => void) => void;

interface Notification {
  onSuccess: OnSuccess;
  onError: OnError;
  onCustomError: OnCustomError;
}

function notification(showError = true, showSuccess = true): Notification {
  const toast = useToast();
  const { t } = useI18n();

  const onSuccess: OnSuccess = (message, callback) => {
    if (showSuccess) {
      toast.add({
        severity: 'success',
        detail: message,
        life: 5000,
      });
    }

    if (callback) callback();
  };

  const onError: OnError = (error, callback) => {
    const message: string = error?.response?.data?.message;
    const errors: string[][] = error?.response?.data?.errors;

    if (showError) {
      if (message) {
        toast.add({
          severity: 'error',
          detail: message,
          life: 5000,
        });
      }

      if (errors) {
        const errorsArray = Object.values(errors).reduce((errorsAcc, error) => {
          errorsAcc.push(...(Array.isArray(error) ? error : []));

          return errorsAcc;
        }, []);

        errorsArray.forEach((errorMessage) => {
          toast.add({
            severity: 'error',
            summary: message,
            detail: errorMessage,
            life: 5000,
          });
        });
      }
    }

    if (callback) callback(error);
  };

  const onCustomError: OnCustomError = (error, callback) => {
    if (error.response.status === 400 || error?.code === 'ECONNABORTED') {
      toast.add({
        severity: 'error',
        detail: t('messages.errorLimitMessage'),
        life: 5000,
      });
    } else {
      onError(error, callback);
    }

    if (callback) callback(error);
  };

  return { onSuccess, onError, onCustomError };
}

export default notification;
export type { OnSuccess, OnError, CustomError };
