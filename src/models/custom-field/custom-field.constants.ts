export enum CustomFieldTarget {
    CUSTOMER = 'Customer',
    PRODUCT = 'Product',
    ORDER = 'Order',
}

export const CustomerCustomFieldTarget = [
    CustomFieldTarget.CUSTOMER,
    CustomFieldTarget.ORDER,
];

export enum CustomFieldType {
    SELECT = 'Select',
    INPUT = 'Input',
}

export enum CustomFieldSubType {
    NUMBER = 'Number',
    STRING = 'String',
    BOOLEAN = 'Boolean',
    DATE = 'Date',
}