import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../shared/theme";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: {
  name:       string;
  label:      string;
  icon:       IoniconName;
  iconActive: IoniconName;
}[] = [
  { name: "index",   label: "Trang chủ", icon: "home-outline",         iconActive: "home"          },
  { name: "search",  label: "Tìm kiếm",  icon: "search-outline",       iconActive: "search"        },
  { name: "map",     label: "Bản đồ",    icon: "map-outline",           iconActive: "map"           },
  { name: "chat",    label: "AI Chat",   icon: "chatbubble-outline",    iconActive: "chatbubble"    },
  { name: "saved",   label: "Đã lưu",    icon: "heart-outline",         iconActive: "heart"         },
  { name: "profile", label: "Tôi",       icon: "person-circle-outline", iconActive: "person-circle" },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 49 + insets.bottom;

  return (
    <Tabs
      screenOptions={({ route }) => {
        const tab = TABS.find(t => t.name === route.name);
        return {
          headerShown: false,
          tabBarActiveTintColor:   Colors.cyan,
          tabBarInactiveTintColor: "rgba(255,255,255,0.38)",
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize:   10,
            fontWeight: "600",
            marginTop:  -2,
            letterSpacing: 0.1,
          },
          tabBarStyle: {
            backgroundColor: "rgba(3,10,22,0.98)",
            borderTopWidth:  0.5,
            borderTopColor:  "rgba(255,255,255,0.10)",
            height:          tabBarHeight,
            paddingBottom:   insets.bottom,
            paddingTop:      8,
            ...(Platform.OS === "android" ? { elevation: 0 } : {}),
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? tab!.iconActive : tab!.icon}
              size={24}
              color={color}
            />
          ),
        };
      }}
    >
      {TABS.map(t => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.label }} />
      ))}
    </Tabs>
  );
}
