type Props = {
    checked: boolean;
    indeterminate?: boolean;
    onChange: () => void;
     
};

export default function SelectButton({ checked, indeterminate = false, onChange }: Props) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onChange();
            }}
            className={`flex h-5 w-5 items-center justify-center rounded border transition-colors cursor-pointer ${
                checked || indeterminate
                    ? "border-black bg-black"
                    : "border-gray-300 bg-white hover:border-gray-400"
            }`}
        >
            {checked ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-3.5 w-3.5 text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 7"
                    />
                </svg>
            ) : indeterminate ? (
                <span className="h-0.5 w-2.5 rounded-full bg-white" />
            ) : null}
        </button>
    );
}