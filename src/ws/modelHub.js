import * as signalR from "@microsoft/signalr";
import { ref } from "vue";

const modelHub = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7024/training")
    .withAutomaticReconnect()
    .build();

export default modelHub;