import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Divider, TextContainer, Form, Text, FormLayout, TextField, Button } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";


  export function KeyManager() {
  const [mngKey, setMngKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);

  function enterKeyValue(value)
  {
     setMngKey(value);
  }



    const {
    data
  } = useAppQuery({
    url: "/api/keys/shopkey",
    reactQueryOptions: {
      onSuccess: () => {
        if(data){
                  console.log(data.mngKey);
                  setMngKey(data.mngKey);
                  setIsLoading(false);

        }

      },
    },
  });

   
const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );


    const saveKey = async () => {
      setIsLoading(true);
    const response = await fetch("/api/keys/save?mngKey="+mngKey);
    if (response.ok) {
      setIsLoading(false);
               console.log(response.json());

      setToastProps({
        content: "successful key set",
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "Error occurred",
        error: true,
      });
    }
  };

  return (
     <>
      {toastMarkup}
    <Card
     title="Nubble API Key Manager"
        sectioned
        >
        <TextContainer spacing="loose">
          <p>Fill in your mngKey:</p>
          </TextContainer>
      <form>
        <TextField onChange={enterKeyValue} autoComplete="off" name="mngKey" type="text" value={mngKey} />
         
          <Text variant="headingXs" as="h6" style="padding:20px;">
            Use the button below to save your mngKey (API Key);
          </Text>
         <Divider borderColor="transparent" />
        <Button size="large"  loading={isLoading} primary="true" textAlign="center" onClick={saveKey}> Save Key </Button>
        
      </form>
    </Card>
    </>
  );
};

//export default KeyManager;