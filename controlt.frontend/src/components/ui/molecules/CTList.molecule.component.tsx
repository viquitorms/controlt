import CTListText, { type ICTListText } from "../atoms/list/CTListText.atom.component";
import CTListButton, { type ICTListButton } from "../atoms/list/CTListButton.atom.component";
import { useSnackbar } from "../../../contexts/Snackbar.context";

export interface ICTList {
    type: "text" | "button";
    buttonType?: ICTListButton[];
    textType?: ICTListText[];
}

export default function CTList(
    {
        type,
        buttonType,
        textType,
    }: ICTList
) {
    const { showSnackbar } = useSnackbar();

    if (type === "button" && buttonType) {
        return (
            buttonType.map((button) => (
                <CTListButton {...button} key={button.id} />
            ))
        );
    }
    else if (type === "text" && textType) {
        return (
            textType.map((text) => (
                <CTListText {...text} key={text.id} />
            ))
        );
    }
    else {
        showSnackbar("Tipo de lista inválido ou lista vazia", 5000, "error");
    }
}