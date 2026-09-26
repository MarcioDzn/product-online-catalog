import Button from "./Button";

type Props = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isPending?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isPending = false,
    onConfirm,
    onCancel,
}: Props) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
                <div className="flex flex-col gap-2">
                    <h2
                        id="confirm-modal-title"
                        className="text-lg font-semibold text-gray-900"
                    >
                        {title}
                    </h2>

                    <p className="text-sm leading-6 text-gray-600">
                        {message}
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        type="button"
                        disabled={isPending}
                        className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type="button"
                        disabled={isPending}
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        {isPending ? "Excluindo..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
