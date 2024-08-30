import { useEffect, useReducer, useRef } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import { z } from "zod";
import { useKeepAwake } from "expo-keep-awake";

const urls = {
  datetime: "https://worldtimeapi.org/api/timezone/America/Sao_Paulo",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com.br",
  linkedin: "https://www.linkedin.com",
  duolingo: "https://www.duolingo.com",
  fluency: "https://fluencyacademy.io"
};

const schema = z.object({
  datetime: z.string(),
});

const initial: State = {
  isLoading: true,
  currentHour: undefined,
  url: undefined,
};

type State = {
  isLoading: boolean;
  currentHour: number | undefined;
  url: string | undefined;
};

type Action =
  | {
    type: "set_current_hour";
    payload: number | undefined;
  }
  | {
    type: "set_is_loading";
    payload: boolean;
  }
  | {
    type: "set_url";
    payload: string | undefined;
  };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set_current_hour": {
      return { ...state, currentHour: action.payload };
    }
    case "set_is_loading": {
      return { ...state, isLoading: action.payload };
    }
    case "set_url": {
      return { ...state, url: action.payload };
    }
    default: {
      return state;
    }
  }
}

export default function App() {
  useKeepAwake();
  const webViewRef = useRef<WebView>(null);
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    getDateTime();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getDateTime();
    }, 300000);
    return () => clearInterval(intervalId);
  }, []);

  async function getDateTime() {
    const response = await fetch(urls.datetime);
    const json = await response.json();
    const worldTime = schema.parse(json);
    const time = new Date(worldTime.datetime);
    dispatch({ type: "set_current_hour", payload: time.getHours() });
    dispatch({ type: "set_is_loading", payload: false });
  }

  if (state.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="red" />
      </View>
    );
  }

  if (
    state.currentHour !== undefined &&
    (state.currentHour >= 23 || state.currentHour <= 5)
  ) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>It is time to rest a little bit</Text>
      </View>
    );
  }

  if (!state.url) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Button
          title="Instagram"
          onPress={() => dispatch({ type: "set_url", payload: urls.instagram })}
        />
        <Button
          title="Youtube"
          onPress={() => dispatch({ type: "set_url", payload: urls.youtube })}
        />
        <Button
          title="Linkedin"
          onPress={() => dispatch({ type: "set_url", payload: urls.linkedin })}
        />
        <Button
          title="Duolingo"
          onPress={() => dispatch({ type: "set_url", payload: urls.duolingo })}
        />
        <Button
          title="Fluency"
          onPress={() => dispatch({ type: "set_url", payload: urls.fluency })}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 40,
      }}
    >
      <WebView
        ref={webViewRef}
        style={{
          flex: 1,
        }}
        source={{
          uri: state.url,
        }}
        allowsFullscreenVideo
        userAgent={
          state.url === urls.duolingo
            ? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
            : undefined
        }
        mediaCapturePermissionGrantType="grant"
      />
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1 }}>
          <Button
            title="prev"
            onPress={() => {
              webViewRef.current?.goBack();
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="reset"
            onPress={() => {
              dispatch({ type: "set_url", payload: undefined });
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="next"
            onPress={() => {
              webViewRef.current?.goForward();
            }}
          />
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}
