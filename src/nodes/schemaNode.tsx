import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps, useReactFlow, Node } from '@xyflow/react';

export type SchemaNode = Node<
  { 
    schemaName: string; 
    onNameChange?: (name: string) => void,
  },
  'schema-node'
>;

export function onNameChange(name: string) {
  console.log("Schema name changed to:", name);
  // Replace this with your EdgeDB initialization logic.
}

export function SchemaNode({ data, id }: NodeProps<SchemaNode>) {
  const { setNodes } = useReactFlow();

  const [formValues, setFormValues] = useState({
    schemaName: data.schemaName || '',
  });

  // New state for custom fields.
  const [customFields, setCustomFields] = useState<{ label: string; value: string; types?: string[] }[]>([]);

  const [showTypePopup, setShowTypePopup] = useState(false);
  const [enteredFieldName, setEnteredFieldName] = useState<string>('');
  const [selectedFieldType, setSelectedFieldType] = useState<string>('');

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, [name]: value } } : n
      )
    );
    if (name === 'schemaName') {
      data.onNameChange?.(value);
    }
  }, [id, setNodes, data]);

  const handleCustomFieldChange = useCallback((index: number, value: string) => {
    setCustomFields((prev) => {
      const newFields = [...prev];
      newFields[index] = { ...newFields[index], value };
      return newFields;
    });
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, customFields: customFields } } : n
      )
    );
  }, [id, setNodes, customFields]);

  // Show type popup when + button is clicked.
  const handleAddField = useCallback(() => {
    setShowTypePopup(true);
  }, []);

  // Updated to use a single selectedFieldType
  const handlePopupTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFieldType(event.target.value);
  }, []);

  const handleConfirmField = useCallback(() => {
    console.log('Confirming field:', enteredFieldName, selectedFieldType);
    if (enteredFieldName !== '' && selectedFieldType !== '') {
      const newField = {
        label: `${enteredFieldName} (${selectedFieldType})`, // Combine the field name and type here
        value: '',
        types: [selectedFieldType]
      };
      setCustomFields((prev) => [...prev, newField]);
      setShowTypePopup(false);
      setEnteredFieldName('');
      setSelectedFieldType('');
    }
  }, [enteredFieldName, selectedFieldType]);

  const availableTypes = [
    'bool',
    'str',
    'int16',
    'int32',
    'float32',
    'uuid',
    'json',
    'datetime',
    'duration',
    'bytes'
  ];

  return (
    <div 
      className="schema-node-wrapper" 
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}
    >      
      <div 
        className="schema-node" 
        style={{
          display: 'grid',
          gap: '10px',
        }}
      >
        {/* Schema Name row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <label htmlFor={`schemaName-${id}`}>Schema Name:</label>
          <input
            id={`schemaName-${id}`}
            name="schemaName"
            type="text"
            value={formValues.schemaName}
            onChange={handleInputChange}
            placeholder="Enter Schema Name"
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      
        {/* Render dynamic custom fields */}
        {customFields.map((field, index) => (
          <div 
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <label htmlFor={`customField-${id}-${index}`}>{field.label}:</label>
            <select
              id={`customField-${id}-${index}`}
              name={`customField-${index}`}
              value={field.value}
              onChange={(e) => handleCustomFieldChange(index, e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ width: '100%' }}
            >
              <option value="optional">Optional</option>
              <option value="required">Required</option>
            </select>
          </div>
        ))}

        {/* + button for adding new fields */}
        <button 
          onClick={handleAddField}
          style={{
            padding: '5px 10px',
            border: 'none',
            background: '#0078d4',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            width: 'fit-content'
          }}
        >
          +
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} />

      {/* Popup for schema type single-select */}
      {showTypePopup && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            right: '20%',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 100,
          }}
        >
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <label htmlFor="fieldName">Field Name:</label>
            <input 
              id="fieldName"
              type="text"
              value={enteredFieldName}
              onChange={(e) => setEnteredFieldName(e.target.value)}
              placeholder="Enter Field Name"
              style={{ width: '90%', marginTop: '5px' }}
            />
          </div>
          <label htmlFor="fieldName">Select Field Type:</label>
          <select
            value={selectedFieldType}
            onChange={handlePopupTypeChange}
            style={{ width: '100%', minHeight: '20px' }}
          >
            <option value="" disabled>Select Type</option>
            {/* Map through available types to create options */}
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <button 
              onClick={() => setShowTypePopup(false)}
              style={{
                padding: '5px 10px',
                marginRight: '10px',
                border: 'none',
                background: '#ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmField}
              style={{
                padding: '5px 10px',
                border: 'none',
                background: '#0078d4',
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
