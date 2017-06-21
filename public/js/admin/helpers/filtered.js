export default function(entityName, filterString, label = "SEE_RELATED", size = "xs") {
    return `<ma-filtered-list-button entity-name="${entityName}"
            filter="${filterString}" size="${size}"
            label="${label}">
        </ma-filtered-list-button>`;
};