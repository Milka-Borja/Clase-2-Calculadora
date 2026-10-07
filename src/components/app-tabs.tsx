import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#ffffff"
      iconColor="#001F3F"
      indicatorColor="#b5bbc8"
      labelStyle={{ default: { color: '#5a6e82' }, selected: { color: '#001F3F' } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Materias</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
