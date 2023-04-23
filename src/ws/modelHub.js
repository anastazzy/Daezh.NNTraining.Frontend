import * as signalR from "@microsoft/signalr";

const modelHub = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7020/training")
    .withAutomaticReconnect()
    .build();

export default modelHub;