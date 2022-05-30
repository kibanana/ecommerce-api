export enum OrderStatus {
    INCOMPLETE_PAYMENT = 'IncompletePayment', // 미결제
    COMPLETE_PAYMENT = 'CompletePayment', // 결제완료
    CANCEL_PAYMENT = 'CancelPayment', // 결제취소
    PREPARE_DELIVERY = 'PrepareDelivery', // 배송준비중
    IN_DELIVERY = 'InDelivery', // 배송중
    COMPLETE_DELIVERY = 'CompleteDelivery', // 배송완료
    CONFIRM_PURCHASE = 'ConfirmPurchase', // 구매확정
    REQUEST_CANCELLATION = 'RequestCancellation', // 취소요청
    COMPLETE_CANCELLATION = 'CompleteCancellation', // 취소완료
    REQUEST_RETURN = 'RequestReturn', // 반품요청
    COMPLETE_RETURN = 'CompleteReturn', // 반품완료
    REQUEST_EXCHANGE = 'RequestExchange', // 교환요청
    COMPLETE_EXCHANGE = 'CompleteExchange', // 교환완료
}

export const StoreOrderStatus = [
    OrderStatus.COMPLETE_PAYMENT,
    OrderStatus.CANCEL_PAYMENT,
    OrderStatus.PREPARE_DELIVERY,
    OrderStatus.IN_DELIVERY,
    OrderStatus.COMPLETE_DELIVERY,
    OrderStatus.COMPLETE_CANCELLATION,
    OrderStatus.COMPLETE_RETURN,
    OrderStatus.COMPLETE_EXCHANGE,
];

export const CustomerOrderStatus = [
    OrderStatus.CONFIRM_PURCHASE,
    OrderStatus.REQUEST_CANCELLATION,
    OrderStatus.REQUEST_RETURN,
    OrderStatus.REQUEST_EXCHANGE,
];
