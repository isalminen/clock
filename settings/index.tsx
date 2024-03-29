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
        <Text>
          Toggling the "Show resting HR" setting on makes heart rate activity
          show also the resting heart rate with the current heart rate.
        </Text>
        <Toggle
          settingsKey="showRHR"
          label="Show resting HR:"/>
        <Select 
          title="First activity"
          label="First activity"
          settingsKey="activity1"
          options={[
            {name: "Heart Rate/Resting Heart Rate", value: "heart-rate"},
            {name: "Steps", value: "steps"},
            {name: "Floors", value: "floors"},
            {name: "Distance", value: "distance"},
            {name: "Calories", value: "energy"},
            {name: "Active minutes", value: "zones"},
          ]}
        />
        <Select 
          title="Second activity"
          label="Second activity"
          settingsKey="activity2"
          options={[
            {name: "Steps", value: "steps"},
            {name: "Floors", value: "floors"},
            {name: "Distance", value: "distance"},
            {name: "Calories", value: "energy"},
            {name: "Heart Rate/Resting Heart Rate", value: "heart-rate"},
            {name: "Active minutes", value: "zones"},
          ]}
        />
        <Select 
          title="Third activity"
          label="Third activity"
          settingsKey="activity3"
          options={[
            {name: "Floors", value: "floors"},
            {name: "Distance", value: "distance"},
            {name: "Calories", value: "energy"},
            {name: "Heart Rate/Resting Heart Rate", value: "heart-rate"},
            {name: "Steps", value: "steps"},
            {name: "Active minutes", value: "zones"},
          ]}
        />
    </Section>
    <Section
     description={<Text>Twilight Setting</Text>}
     title={<Text bold align="center">Twilight Setting</Text>}>
       <Text>Twilight setting allows you to adjust sunrise and
             sunset event times to match the twilight. Selecting
             the twilight makes the sunrise event happen earlier
             and the sunset event later.
       </Text>
       <Select
        title="Sunrise and sunset happens at:"
        label="Twilight"
        settingsKey="zenith"
        options={[
          {name: "Actual Sunrise & Sunset", value: "90.883"},
          {name: "Civil Twilight", value: "96"},
          {name: "Nautical Twilight", value: "102"},
          {name: "Astronomical Twilight", value: "108"}
        ]}/>
    </Section>
    <Section
      description={<Text>Color Settings</Text>}
      title={<Text bold align="center">Color Settings</Text>}>
        <Text>Hour colour:</Text>
        <ColorSelect
          settingsKey="hoursColour"
          colors={[
            {color: 'firebrick'},
            {color: 'peachpuff'},
            {color: 'lightgoldenrodyellow'},
            {color: 'aquamarine'},
            {color: 'rosybrown'},
            {color: 'sienna'},
            {color: 'aliceblue'},
            {color: 'cornflowerblue'},
            {color: 'steelblue'},
            {color: 'navy'},
            {color: 'darkred'},
            {color: 'tomato'},
            {color: 'orange'},
            {color: 'khaki'},
            {color: 'palegreen'},
            {color: 'slategrey'},
            {color: 'seashell'},
            {color: 'deeppink'},
            {color: 'gold'},
            {color: 'yellow'},
            {color: 'goldenrod'},
            {color: 'darkseagreen'},
            {color: 'black'},
            {color: 'white'}
          ]}
        />
        <Text>Minute colour:</Text>
        <ColorSelect
          settingsKey="minutesColour"
          colors={[
            {color: 'firebrick'},
            {color: 'peachpuff'},
            {color: 'lightgoldenrodyellow'},
            {color: 'aquamarine'},
            {color: 'rosybrown'},
            {color: 'sienna'},
            {color: 'aliceblue'},
            {color: 'cornflowerblue'},
            {color: 'steelblue'},
            {color: 'navy'},
            {color: 'darkred'},
            {color: 'tomato'},
            {color: 'orange'},
            {color: 'khaki'},
            {color: 'palegreen'},
            {color: 'slategrey'},
            {color: 'seashell'},
            {color: 'deeppink'},
            {color: 'gold'},
            {color: 'yellow'},
            {color: 'goldenrod'},
            {color: 'darkseagreen'},
            {color: 'black'},
            {color: 'white'}
          ]}
        />        
        <Text>Activity colour:</Text>
        <ColorSelect
          settingsKey="sensorDataColour"
          colors={[
            {color: 'firebrick'},
            {color: 'peachpuff'},
            {color: 'lightgoldenrodyellow'},
            {color: 'aquamarine'},
            {color: 'rosybrown'},
            {color: 'sienna'},
            {color: 'aliceblue'},
            {color: 'cornflowerblue'},
            {color: 'steelblue'},
            {color: 'navy'},
            {color: 'darkred'},
            {color: 'tomato'},
            {color: 'orange'},
            {color: 'khaki'},
            {color: 'palegreen'},
            {color: 'slategrey'},
            {color: 'seashell'},
            {color: 'deeppink'},
            {color: 'gold'},
            {color: 'yellow'},
            {color: 'goldenrod'},
            {color: 'darkseagreen'},
            {color: 'black'},
            {color: 'white'}
          ]}
        />
        <Text>Status (date, sunset, sunrise and battery) colour:</Text>
        <ColorSelect
          settingsKey="statusColour"
          colors={[
            {color: 'firebrick'},
            {color: 'peachpuff'},
            {color: 'lightgoldenrodyellow'},
            {color: 'aquamarine'},
            {color: 'rosybrown'},
            {color: 'sienna'},
            {color: 'aliceblue'},
            {color: 'cornflowerblue'},
            {color: 'steelblue'},
            {color: 'navy'},
            {color: 'darkred'},
            {color: 'tomato'},
            {color: 'orange'},
            {color: 'khaki'},
            {color: 'palegreen'},
            {color: 'slategrey'},
            {color: 'seashell'},
            {color: 'deeppink'},
            {color: 'gold'},
            {color: 'yellow'},
            {color: 'goldenrod'},
            {color: 'darkseagreen'},
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
            {name:"Use your own image", value: "__own_image__"},
          ]}
        />
        <ImagePicker
          title="Image Picker"
          description="Choose your own image for the background"
          label="Pick an Image"
          settingsKey="ownImage"
          imageWidth="336"
          imageHeight="336"
        />        
    </Section>
    </Page>
  );
}

registerSettingsPage(ClockSettings);
