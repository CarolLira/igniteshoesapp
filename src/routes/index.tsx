import { useEffect, useState } from 'react';
import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
// import * as Linking from 'expo-linking';
import { OneSignal, OSNotification } from 'react-native-onesignal';

import { Notification } from '../components/Notification';

import { AppRoutes } from './app.routes';

const linking = {
  prefixes: [
    'igniteshoesapp://', 
    'com.project.igniteshoes://',
    'exp+igniteshoesapp://',
  ],
  config: {
    screens: {
      details: {
        path: 'details/:productId',
        parse: {
          productId: (productId: string) => productId,
        }
      },
      cart: {
        path: 'cart',
      }
    }
  }
};

export function Routes() {
  const [notification, setNotification] = useState<OSNotification>();

  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  // const deepLinking = Linking.createURL('details', {
  //   queryParams: {
  //     productId: '7',
  //   }
  // });

  // console.log('deepLinking', deepLinking);

  useEffect(() => {
    const unsubscribe = OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      event.preventDefault();
      // some async work
      const response = event.notification;
      setNotification(response);

      // Use display() to display the notification after some async work
      event.getNotification().display();
    })

    return () => unsubscribe;
  }, []);

  return (
    <NavigationContainer theme={theme} linking={linking}>
      <AppRoutes />
      {
        notification?.title &&
        <Notification
          data={notification}
          onClose={() => { setNotification(undefined) }}
        />
      }
    </NavigationContainer>
  );
}