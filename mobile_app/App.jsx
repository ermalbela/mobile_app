import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthContext from './_helper/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { LoadingProvider } from './_helper/LoadingContext';
import { registerTranslation } from 'react-native-paper-dates'

registerTranslation('en', {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select period',
  notAccordingToDateFormat: inputFormat => `Date format must be ${inputFormat}`,
  mustBeHigherThan: date => `Must be after ${date}`,
  mustBeLowerThan: date => `Must be before ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: 'Day is not allowed',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close'
})
export default function App() {
  const [role, setRole] = useState([]);
  const roleValue = useMemo(() => ({ role, setRole }), [role, setRole]);


  return (
    <LoadingProvider>
      <AuthContext.Provider value={roleValue}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthContext.Provider>
    </LoadingProvider>
  );
}
