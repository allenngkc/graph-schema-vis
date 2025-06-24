import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps, useReactFlow, Node } from '@xyflow/react';

export type InitNode = Node<
  { 
    schemaName: string; 
    description?: string; 
    module?: string; 
    onNameChange?: (name: string) => void,
  },
  'init-node'
>;

export function onNameChange(name: string) {
  console.log("Schema name changed to:", name);
  // Save info to some JSON and cache
  // Replace this with your EdgeDB initialization logic.
}

export function InitNode({ data, id }: NodeProps<InitNode>) {
  const { setNodes } = useReactFlow();

  const [formValues, setFormValues] = useState({
    schemaName: data.schemaName || '',
    description: data.description || '',
    module: data.module || '',
  });

  // New state for custom fields. Extended to include an optional types property.
  const [customFields, setCustomFields] = useState<{ label: string; value: string; types?: string[] }[]>([]);

  const [showTypePopup, setShowTypePopup] = useState(false);
  const [selectedFieldTypes, setSelectedFieldTypes] = useState<string[]>([]);
  
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Update the node's data via React Flow
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
    // Optionally update node data with custom fields:
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, customFields: customFields } } : n
      )
    );
  }, [id, setNodes, customFields]);

  // Instead of immediately adding a field, show the popup to select schema types.
  const handleAddField = useCallback(() => {
    setShowTypePopup(true);
  }, []);

  // Called when user confirms selection from the popup.
  const handleConfirmFieldAdd = useCallback(() => {
    setCustomFields((prev) => [
      ...prev,
      { label: `Field ${prev.length + 1}`, value: '', types: selectedFieldTypes }
    ]);
    setShowTypePopup(false);
    setSelectedFieldTypes([]);
  }, [selectedFieldTypes]);

  const handlePopupTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedFieldTypes(selected);
  }, []);

  return (
    <div 
      className="init-node-wrapper" 
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      <div 
        className="init-node" 
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
        
        {/* Description row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <label htmlFor={`description-${id}`}>Description:</label>
          <input
            id={`description-${id}`}
            name="description"
            type="text"
            value={formValues.description}
            onChange={handleInputChange}
            placeholder="Enter Description"
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Module row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <label htmlFor={`module-${id}`}>Module:</label>
          <input
            id={`module-${id}`}
            name="module"
            type="text"
            value={formValues.module}
            onChange={handleInputChange}
            placeholder="Enter Module"
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
            <input
              id={`customField-${id}-${index}`}
              name={`customField-${index}`}
              type="text"
              value={field.value}
              onChange={(e) => handleCustomFieldChange(index, e.target.value)}
              placeholder="Enter Value"
              onMouseDown={(e) => e.stopPropagation()}
            />
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

      {/* Popup for schema type multi-select */}
      {showTypePopup && (
        <div
          onWheelCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onWheel={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
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
          <h4>Select Schema Types</h4>
          <select
            multiple
            value={selectedFieldTypes}
            onChange={handlePopupTypeChange}
            style={{ width: '100%', minHeight: '80px' }}
          >
            <option value="bool">bool</option>
            <option value="str">str</option>
            <option value="int16">int16</option>
            <option value="int32">int32</option>
            <option value="float32">float32</option>
            <option value="uuid">uuid</option>
            <option value="json">json</option>
            <option value="datetime">datetime</option>
            <option value="duration">duration</option>
            <option value="bytes">bytes</option>
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
              onClick={handleConfirmFieldAdd}
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
