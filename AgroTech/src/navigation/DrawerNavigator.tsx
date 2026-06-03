import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import DashboardScreen from "../screens/Dashboardscreen";
import PlantationScreen from "../screens/PlantationScreen";
import DetalhesPropriedadeScreen from "../screens/Detalhespropriedadescreen";
import FormPropriedadeScreen from "../screens/Formpropriedadescreen";
import AlertasScreen from "../screens/Alertasscreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import RelatoriosScreen from "../screens/RelatoriosScreen";

import SidebarMenu from "../components/SidebarMenu";
import AppHeader from "../components/AppHeader";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidebarMenu {...props} />}
      screenOptions={{
        header: ({ navigation }) => <AppHeader navigation={navigation} />,
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Propriedades" component={PlantationScreen} />
      <Drawer.Screen
        name="DetalhesPropriedade"
        component={DetalhesPropriedadeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="NovaPropriedade"
        component={FormPropriedadeScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen name="Alertas" component={AlertasScreen} />
      <Drawer.Screen name="Relatorios" component={RelatoriosScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer.Navigator>
  );
}