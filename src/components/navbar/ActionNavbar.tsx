import Navbar from "./Navbar";
import Button from "../button/Button";
import { useContext } from "react";
import { PageActionContext } from "../../context/PageActionContext";


export default function ActionNavbar() {
    const { action } = useContext(PageActionContext);

    return (
        <>
            <Navbar>
                <div className="flex justify-end w-full">
                    {action && (
                        <Button
                            type="submit"
                            formId={action.formId}
                            disabled={action.isPending || action.disabled}
                            onClick={() => {}}
                        >
                            {action.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                </span>
                            ) : (
                                action.label
                            )}
                        </Button>
                    )}
                </div>


            </Navbar>
        </>
    )
}