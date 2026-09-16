import { useEffect, useRef, useState } from "react";
import styles from "./Selectbox.module.scss";

interface SelectboxOption {
    name: string;
    value?: string | number;
}
interface Selectbox {
    text: string;
    options: SelectboxOption[];
    onSelectChange?: (method: string) => void;
}

type SelectboxOptionProps = SelectboxOption & {onClick: (option: SelectboxOption["name"]) => void} & {selected: string | null};

const SelectboxOption: React.FC<SelectboxOptionProps> = ({name, value, selected, onClick}) => {
    const className = styles.option + (name === selected ? ` ${styles.optionSelected}` : "");

    const clickEventHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        onClick(event.currentTarget.dataset.name as SelectboxOption["name"]);
    }

    return <div className={className} data-name={name} onClick={clickEventHandler}>{value}</div>
}

const Selectbox: React.FC<Selectbox> = ({text, options, onSelectChange}) => {

    const [opened, setOpened] = useState<boolean>(false);
    const [selected, setSelected] = useState<null | SelectboxOption["name"]>(null);
    const selectboxWrapperRef = useRef<HTMLDivElement>(null);

    const selectboxClickEvent = () => {
        setOpened(!opened);
    }
    const optionClickEvent = (option: SelectboxOption["name"]) => {
        if (option === selected) return null;
        setSelected(option);
        setOpened(false);
        if (onSelectChange) {
            onSelectChange(option);
        }
    }

    useEffect(() => {
        const callback = (event: PointerEvent) => {
            const target = event.target;
            const selectboxWrapper = selectboxWrapperRef.current!;
            if (selectboxWrapper !== target && !selectboxWrapper.contains(target as Node)) {
                setOpened(false);
            }
        }
        window.document.addEventListener("click", callback);
        return () => {
            window.document.removeEventListener("click", callback);
        }
    }, []);

    return <div className={styles.selectboxWrapper} ref={selectboxWrapperRef}>
        <div className={styles.selectbox} onClick={selectboxClickEvent}>
            <div className={styles.text}>{selected ? selected : text}</div>
            <div className={opened ? `${styles.arrowOpen + " " + styles.arrow}` : styles.arrow}>
                <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
            </div>
        </div>
        <div className={opened ? styles.options : styles.optionsHide}>
            {options.map(option => <SelectboxOption name={option.name} value={option.value} selected={selected} onClick={optionClickEvent} />)}
        </div>
    </div>
    ;
}

export default Selectbox;
export {SelectboxOption}