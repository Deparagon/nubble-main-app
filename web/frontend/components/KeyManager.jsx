import React, { useState, useEffect } from "react";
import { Card, Divider, TextContainer, Form, Text, FormLayout, TextField, Button } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useMutation } from 'react'
import { useAppQuery, useAuthenticatedFetch } from "../hooks";


  export function KeyManager() {
  const [mngKey, setMngKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      onSettled: () => {
        if(data){
                  setIsLoading(false);
                  console.log(data.mngKey);
                  setMngKey(data.mngKey);
                  setIsLoading(false);

        }

      },
    },
  });

setTimeout(function(){
        if(data){
           setMngKey(data.mngKey);
        }
}, 3500);

const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );


    const saveKey = async () => {
      setIsLoading(true);
      if(mngKey ==""){
            setIsLoading(false);
      setToastProps({
        content: "Your API key is required and cannot be empty",
        error: true,
      });
      return;
      }
    const response = await fetch("/api/keys/save?mngKey="+mngKey);
    if (response.ok) {
      setIsLoading(false);
               console.log(response.json());

      setToastProps({
        content: "successfully saved mngKey",
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
            Use the button below to save your mngKey (API Key)
          </Text>
           <br/>  <br/>
         <Divider style={{ padding: "20px 20px" }} borderColor="transparent" />
        <Button style={{ marginTop: "20px" }} size="large"  loading={isLoading} primary="true" textAlign="center" onClick={saveKey}> Save Key </Button>
        
      </form>
    </Card>
    </>
  );
};

//export default KeyManager;