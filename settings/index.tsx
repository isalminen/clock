function ClockSettings(props) {
  const pos =  props.settings.location ? JSON.parse(props.settings.location) : {};
  return (
    <Page>
    <Section
      description={<Text> Location Settings</Text>}
      title={<Text bold align="center">Location Settings</Text>}>
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
        <Text bold>Current location: </Text>
        {
          pos.latitude && pos.longitude ? `latitude: ${pos.latitude}, longitude: ${pos.longitude}` : "Location not set"
        }
      </Text>
    </Section>
    <Section
      description={<Text>Activities</Text>}
      title={<Text bold align="center">Activities</Text>}>
        <Select 
          title="First activity"
          label="First activity"
          settingsKey="activity1"
          options={[
            {name:"Heart Rate", value: "heart-rate"},
            {name:"Steps", value: "steps"},
            {name:"Floors", value: "floors"},
            {name:"Distance", value: "distance"},
            {name:"Calories", value: "energy"},
          ]}
        />
        <Select 
          title="Second activity"
          label="Second activity"
          settingsKey="activity2"
          options={[
            {name:"Steps", value: "steps"},
            {name:"Floors", value: "floors"},
            {name:"Distance", value: "distance"},
            {name:"Calories", value: "energy"},
            {name:"Heart Rate", value: "heart-rate"},
          ]}
        />
        <Select 
          title="Third activity"
          label="Third activity"
          settingsKey="activity3"
          options={[
            {name:"Floors", value: "floors"},
            {name:"Distance", value: "distance"},
            {name:"Calories", value: "energy"},
            {name:"Heart Rate", value: "heart-rate"},
            {name:"Steps", value: "steps"},
          ]}
        />
    </Section>
    <Section
      description={<Text>Color Settings</Text>}
      title={<Text bold align="center">Color Settings</Text>}>
        <Text>Hour colour:</Text>
        <ColorSelect
          settingsKey="hoursColour"
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'black'},
            {color: 'white'}
          ]}
        />
        <Text>Minute colour:</Text>
        <ColorSelect
          settingsKey="minutesColour"
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'black'},
            {color: 'white'}
          ]}
        />
    </Section>
    <Section
      description={<Text>Background</Text>}
      title={<Text bold align="center">Background</Text>}>
      <Select 
          title="Background"
          label="Background"
          settingsKey="background"
          options={[
            {name:"Starry sky", value: "starry-bg.png"},
            {name:"Black texture", value: "black-bg.png"},
            {name:"Milky Way", value: "milky-way-bg.png"},
          ]}
        />
    </Section>
    </Page>
  );
}

registerSettingsPage(ClockSettings);
