export enum OrderStatus {
    IncompletePayment = 'IncompletePayment', // 미결제
    CompletePayment = 'CompletePayment', // 결제완료
    CancelPayment = 'CancelPayment', // 결제취소
    PrepareDelivery = 'PrepareDelivery', // 배송준비중
    InDelivery = 'InDelivery', // 배송중
    CompleteDelivery = 'CompleteDelivery', // 배송완료
    ConfirmPurchase = 'ConfirmPurchase', // 구매확정
    RequestCancellation = 'RequestCancellation', // 취소요청
    CompleteCancellation = 'CompleteCancellation', // 취소완료
    RequestReturn = 'RequestReturn', // 반품요청
    CompleteReturn = 'CompleteReturn', // 반품완료
    RequestExchange = 'RequestExchange', // 교환요청
    CompleteExchange = 'CompleteExchange', // 교환완료
}

export const StoreOrderStatus = [
    OrderStatus.CompletePayment,
    OrderStatus.CancelPayment,
    OrderStatus.PrepareDelivery,
    OrderStatus.InDelivery,
    OrderStatus.CompleteDelivery,
    OrderStatus.CompleteCancellation,
    OrderStatus.CompleteReturn,
    OrderStatus.CompleteExchange,
];

export const CustomerOrderStatus = [
    OrderStatus.ConfirmPurchase,
    OrderStatus.RequestCancellation,
    OrderStatus.RequestReturn,
    OrderStatus.RequestExchange,
];
