import React, { useState } from 'react';
import {
  render,
  Select,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  useExtensionApi
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::DeliveryAddress::RenderBefore', () => <App />);



function App() {
  const {extensionPoint} = useExtensionApi();
  const [selectedOption, setSelectedOption] = useState('P');

  const metafieldNamespace = "nubbleCommerceFields";
  const metaPiva = "extraFieldPiva";
  const metaCodiceFiscale = "extraFieldCodiceFiscale";
  const metaCodiceDestinatario = "extraFieldCodiceDestinatario";
  const metaPec = "extraFieldPec";

  // Get a reference to the metafield
  const extraFieldPiva = useMetafield({
    namespace: metafieldNamespace,
    key: metaPiva,
  });

  const extraFieldCodiceFiscale = useMetafield({
    namespace: metafieldNamespace,
    key: metaCodiceFiscale,
  });

  const extraFieldCodiceDestinatario = useMetafield({
    namespace: metafieldNamespace,
    key: metaCodiceDestinatario,
  });

  const extraFieldPec = useMetafield({
    namespace: metafieldNamespace,
    key: metaPec,
  });

  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();
  const options = [
    { value: 'A', label: 'AZIENDA' },
    { value: 'P', label: 'PRIVATO' },
  ];

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };
 
  return (
    <BlockStack>
    <Select
      label="Tipologia cliente"
      value="P"
      onChange ={(value) => handleOptionChange(value)}
      options={options}
    />
     {selectedOption === 'P' && (
       <TextField
       label="Inserisci il codice fiscale"
       onChange={(value) => {
         // Apply the change to the metafield
         applyMetafieldsChange({
           type: "updateMetafield",
           namespace: metafieldNamespace,
           key: metaCodiceFiscale,
           valueType: "string",
           value,
         });
       }}
       value={extraFieldCodiceFiscale?.value}
     />

     )}

{selectedOption === 'A' && (
  <><TextField
          label="Inserisci la partita iva"
          onChange={(value) => {
            // Apply the change to the metafield
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metaPiva,
              valueType: "string",
              value,
            });
          } }
          value={extraFieldPiva?.value} /><TextField
            label="Inserisci il codice SDI"
            onChange={(value) => {
              // Apply the change to the metafield
              applyMetafieldsChange({
                type: "updateMetafield",
                namespace: metafieldNamespace,
                key: metaCodiceDestinatario,
                valueType: "string",
                value,
              });
            } }
            value={extraFieldCodiceDestinatario?.value} /><TextField
            label="PEC, valid Email"
            onChange={(value) => {
              // Apply the change to the metafield
              applyMetafieldsChange({
                type: "updateMetafield",
                namespace: metafieldNamespace,
                key: metaPec,
                valueType: "string",
                value,
              });
            } }
            value={extraFieldPec?.value} /></>
)}
    
</BlockStack>


  );
}

