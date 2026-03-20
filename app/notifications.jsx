// Notifications.js

import { View, Text, FlatList, StyleSheet } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Notifications = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("connect", () => {
            setMessages(msgs => [
                ...msgs,
                `Connected to backend with id: ${socket.id}`,
            ]);
        });

        socket.on("food:new", (food) => {
            setMessages(msgs => [
                ...msgs,
                `New food posted: ${JSON.stringify(food)}`,
            ]);
        });

        socket.on("food:accepted", (food) => {
            setMessages(msgs => [
                ...msgs,
                `Food accepted: ${JSON.stringify(food)}`,
            ]);
        });

        socket.on("food:picked", (food) => {
            setMessages(msgs => [
                ...msgs,
                `Food picked up: ${JSON.stringify(food)}`,
            ]);
        });

        socket.on("disconnect", () => {
            setMessages(msgs => [
                ...msgs,
                "Disconnected from backend",
            ]);
        });

        return () => {
            socket.off("connect");
            socket.off("food:new");
            socket.off("food:accepted");
            socket.off("food:picked");
            socket.off("disconnect");
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Food Waste Notifications</Text>
            <FlatList
                data={messages}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    message: { fontSize: 14, marginBottom: 4 },
});

export default Notifications;