function ClockSettings(props) {
  const pos =  props.settings.location ? JSON.parse(props.settings.location) : {};
  return (
    <Section
      description={<Text> Location </Text>}
      title={<Text bold align="center">Suntimes Settings</Text>}>
      <Text>
        You can set the fixed location by typing the name of the location or use 
        the GPS of the phone. 
      </Text>
      <Text>
        Note, that using the GPS does not work very well indoors and also consumes
        the battery.
      </Text>
      <Toggle
        settingsKey="useGPS"
        label="Use GPS for the location:"/>
      <TextInput
        label="City:"
        settingsKey="locationName"
        disabled={(props.settings.useGPS === "true")}/>
      <Text>
        {
          pos.latitude && pos.longitude ? `latitude: ${pos.latitude}, longitude: ${pos.longitude}` : "Location not set"
        }
      </Text>
    </Section>
  );
}

registerSettingsPage(ClockSettings);
