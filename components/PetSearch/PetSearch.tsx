import style from "./PetSearch.module.css";

export type PetSearchCategory = "name" | "species";

type PetSearchProps = {
    id: string;
    category: PetSearchCategory;
    value: string;
    suggestions: string[];
    onCategoryChange: (category: PetSearchCategory) => void;
    onChange: (value: string) => void;
};

export function PetSearch({ id, category, value, suggestions, onCategoryChange, onChange }: PetSearchProps) {
    const listId = `${id}-suggestions`;
    const categoryId = `${id}-category`;

    return (
        <div className={style.pet_search}>
            <div className={style.pet_search_controls}>
                <div className={style.pet_search_category}>
                    <label htmlFor={categoryId}>Search by</label>
                    <select
                        id={categoryId}
                        value={category}
                        onChange={(event) => {
                            onCategoryChange(event.target.value === "species" ? "species" : "name");
                            onChange("");
                        }}
                    >
                        <option value="name">Name</option>
                        <option value="species">Species</option>
                    </select>
                </div>
                <div className={style.pet_search_input}>
                    <label htmlFor={id}>{category === "name" ? "Pet name" : "Pet species"}</label>
                    <input
                        id={id}
                        type="search"
                        list={listId}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={`Type a ${category}...`}
                    />
                </div>
            </div>
            <datalist id={listId}>
                {suggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                ))}
            </datalist>
        </div>
    );
}
