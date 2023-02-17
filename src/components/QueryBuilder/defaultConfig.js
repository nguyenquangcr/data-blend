import React from 'react';
import merge from 'lodash/merge';
import { BasicConfig, BasicFuncs, Utils } from 'react-awesome-query-builder-pd';
import MaterialConfig from 'react-awesome-query-builder-pd/lib/config/material';
import viLocale from 'date-fns/locale/vi';
import MaterialDateWidget from './widgets/DateWidget';

const { simulateAsyncFetch } = Utils;

const skinToConfig = {
  vanilla: BasicConfig,
  material: MaterialConfig
};

export default skin => {
  const InitialConfig = skinToConfig[skin];

  const demoListValues = [
    { title: 'A', value: 'a' },
    { title: 'AA', value: 'aa' },
    { title: 'AAA1', value: 'aaa1' },
    { title: 'AAA2', value: 'aaa2' },
    { title: 'B', value: 'b' },
    { title: 'C', value: 'c' },
    { title: 'D', value: 'd' },
    { title: 'E', value: 'e' },
    { title: 'F', value: 'f' },
    { title: 'G', value: 'g' },
    { title: 'H', value: 'h' },
    { title: 'I', value: 'i' },
    { title: 'J', value: 'j' }
  ];
  const simulatedAsyncFetch = simulateAsyncFetch(demoListValues, 3);

  const conjunctions = {
    ...InitialConfig.conjunctions
  };

  const proximity = {
    ...InitialConfig.operators.proximity,
    valueLabels: [
      { label: 'Word 1', placeholder: 'Enter first word' },
      { label: 'Word 2', placeholder: 'Enter second word' }
    ],
    textSeparators: [
      //'Word 1',
      //'Word 2'
    ],
    options: {
      ...InitialConfig.operators.proximity.options,
      optionLabel: 'Near', // label on top of "near" selectbox (for config.settings.showLabels==true)
      optionTextBefore: 'Near', // label before "near" selectbox (for config.settings.showLabels==false)
      optionPlaceholder: 'Select words between', // placeholder for "near" selectbox
      minProximity: 2,
      maxProximity: 10,
      defaults: {
        proximity: 2
      },
      customProps: {}
    }
  };

  const operators = {
    ...InitialConfig.operators,
    // examples of  overriding
    proximity,
    between: {
      ...InitialConfig.operators.between,
      label: 'between',
      labelForFormat: 'between',
      valueLabels: ['from', 'to'],
      textSeparators: ['from', 'to'],
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        let valFrom = values.first()
        let valTo = values.get(1)
        return `{${field}} BETWEEN ${valFrom} AND ${valTo}`
      }
    },
    equal: {
      ...InitialConfig.operators.equal,
      label: 'equals',
      labelForFormat: 'equals',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          const dateRegex = /([1-2]\d{3}-([0]?[1-9]|1[0-2])-([0-2]?[0-9]|3[0-1]))/gm;
          if (dateRegex.test(values)) {
            return `date({${field}}) = ${values}`;
          } else {
            if (values === 'true') {
              return `{${field}} = 1`;
            } else if(values === 'false') {
              return `{${field}} = 0`;
            } else return `{${field}} = ${values}`;
          }
        }
        return undefined;
      }
    },
    not_equal: {
      ...InitialConfig.operators.not_equal,
      label: 'not equals',
      labelForFormat: 'not equals',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} != ${values}`;
        }
        return undefined;
      }
    },
    less: {
      ...InitialConfig.operators.less,
      label: 'is less than',
      labelForFormat: 'is less than',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} < ${values}`;
        }
        return undefined;
      }
    },
    less_or_equal: {
      ...InitialConfig.operators.less_or_equal,
      label: 'is less than or equal to',
      labelForFormat: 'is less than or equal to',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} <= ${values}`;
        }
        return undefined;
      }
    },
    greater: {
      ...InitialConfig.operators.greater,
      label: 'is greater than',
      labelForFormat: 'is greater than',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} > ${values}`;
        }
        return undefined;
      }
    },
    greater_or_equal: {
      ...InitialConfig.operators.greater_or_equal,
      label: 'is greater than or equal to',
      labelForFormat: 'is greater than or equal to',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} >= ${values}`;
        }
        return undefined;
      }
    },
    like: {
      ...InitialConfig.operators.like,
      label: 'contains',
      labelForFormat: 'contains',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} LIKE '%${values}%'`;
        }
        return undefined;
      }
    },
    starts_with: {
      ...InitialConfig.operators.starts_with,
      label: 'starts with',
      labelForFormat: 'starts with',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} LIKE '${values}%'`;
        }
        return undefined;
      }
    },
    ends_with: {
      ...InitialConfig.operators.ends_with,
      label: 'ends with',
      labelForFormat: 'ends with',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} LIKE '%${values}'`;
        }
        return undefined;
      }
    },
    multiselect_equals: {
      ...InitialConfig.operators.multiselect_equals,
      label: 'is in list',
      labelForFormat: 'is in list',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} IN (${values.map(v => '' + v + '').join(',')})`;
        }
        return undefined;
      }
    },
    multiselect_not_equals: {
      ...InitialConfig.operators.multiselect_not_equals,
      label: 'is not in list',
      labelForFormat: 'is not in list',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          return `{${field}} NOT IN (${values.map(v => '' + v + '').join(',')})`;
        }
        return undefined;
      }
    },
    multiselect_all_in: {
      ...InitialConfig.operators.multiselect_equals,
      label: 'has all in',
      labelForFormat: 'has all in',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          // set
          return `hasAll(splitByString(' - ',{${field}}), [${values
            .map(v => '' + v + '')
            .join(',')}])`;
        }
        return undefined; //not supported
      }
    },
    multiselect_any_in: {
      ...InitialConfig.operators.multiselect_equals,
      label: 'has any in',
      labelForFormat: 'has any in',
      sqlFormatOp: (
        field,
        op,
        values,
        valueSrc,
        valueType,
        opDef,
        operatorOptions
      ) => {
        if (valueSrc == 'value') {
          // set
          return `hasAny(splitByString(' - ',{${field}}), [${values
            .map(v => '' + v + '')
            .join(',')}])`;
        }
        return undefined; //not supported
      }
    }
  };

  const widgets = {
    ...InitialConfig.widgets,
    // examples of  overriding
    text: {
      ...InitialConfig.widgets.text
    },
    textarea: {
      ...InitialConfig.widgets.textarea,
      maxRows: 3
    },
    slider: {
      ...InitialConfig.widgets.slider
    },
    rangeslider: {
      ...InitialConfig.widgets.rangeslider,
      customProps: {
        slider: {
          sx: {
            mt: 2
          }
        }
      }
    },
    date: {
      ...InitialConfig.widgets.date,
      dateFormat: 'dd/MM/yyyy',
      valueFormat: 'YYYY-MM-DD',
      factory: props => <MaterialDateWidget {...props} />
    },
    time: {
      ...InitialConfig.widgets.time,
      timeFormat: 'HH:mm',
      valueFormat: 'HH:mm:ss'
    },
    datetime: {
      ...InitialConfig.widgets.datetime,
      timeFormat: 'HH:mm',
      dateFormat: 'DD.MM.YYYY',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    func: {
      ...InitialConfig.widgets.func,
      customProps: {
        showSearch: true
      }
    },
    select: {
      ...InitialConfig.widgets.select,
      customProps: {
        sx: {
          mt: 2
        }
      }
    },
    multiselect: {
      ...InitialConfig.widgets.multiselect,
      customProps: {
        //showCheckboxes: false,
        width: '500px',
        input: {
          width: '400px'
        }
      }
    },
    treeselect: {
      ...InitialConfig.widgets.treeselect,
      customProps: {
        showSearch: true
      }
    }
  };

  const types = {
    ...InitialConfig.types,
    // examples of  overriding
    boolean: merge(InitialConfig.types.boolean, {
      widgets: {
        boolean: {
          widgetProps: {
            hideOperator: true,
            operatorInlineLabel: ''
          },
          opProps: {
            equal: {
              label: 'is'
            },
            not_equal: {
              label: 'is not'
            }
          }
        }
      }
    }),
    multiselect: {
      defaultOperator: 'multiselect_equals',
      widgets: {
        multiselect: {
          operators: [
            'multiselect_equals',
            'multiselect_not_equals',
            'is_empty',
            'is_not_empty',
            'multiselect_any_in',
            'multiselect_all_in'
          ]
        }
      }
    }
  };

  const localeSettings = {
    locale: {
      // moment: 'ru'
      // antd: ru_RU,
      material: viLocale
    },
    valueLabel: 'Value',
    valuePlaceholder: 'Value',
    fieldLabel: 'Column',
    operatorLabel: 'Operator',
    funcLabel: 'Function',
    fieldPlaceholder: 'Select column',
    funcPlaceholder: 'Select function',
    operatorPlaceholder: 'Select operator',
    deleteLabel: null,
    addGroupLabel: 'Add group',
    addRuleLabel: 'Add rule',
    addSubRuleLabel: 'Add sub rule',
    delGroupLabel: null,
    notLabel: 'Not',
    valueSourcesPopupTitle: 'Select value source',
    removeRuleConfirmOptions: {
      title: 'Are you sure delete this rule?',
      okText: 'Yes',
      okType: 'danger'
    },
    removeGroupConfirmOptions: {
      title: 'Are you sure delete this group?',
      okText: 'Yes',
      okType: 'danger'
    }
  };

  const settings = {
    ...InitialConfig.settings,
    ...localeSettings,

    defaultSliderWidth: '100px',
    defaultSelectWidth: '200px',
    defaultSearchWidth: '100px',
    defaultMaxRows: 20,

    valueSourcesInfo: {
      value: {
        label: 'Value'
      }
    },
    // canReorder: true,
    // canRegroup: true,
    showNot: false,
    showLabels: true,
    maxNesting: 2,
    canLeaveEmptyGroup: true,
    showErrorMessage: true
    // renderField: (props) => <FieldCascader {...props} />,
    // renderOperator: (props) => <FieldDropdown {...props} />,
    // renderFunc: (props) => <FieldSelect {...props} />,
    // maxNumberOfRules: 10 // number of rules can be added to the query builder
  };

  //////////////////////////////////////////////////////////////////////

  const fields = {
    user: {
      label: 'User',
      tooltip: 'Group of fields',
      type: '!struct',
      subfields: {
        firstName: {
          label2: 'Username', //only for menu's toggler
          type: 'text',
          excludeOperators: ['proximity'],
          fieldSettings: {
            validateValue: (val, fieldSettings) => {
              return val.length < 10;
            }
          },
          mainWidgetProps: {
            valueLabel: 'Name',
            valuePlaceholder: 'Enter name'
          }
        },
        login: {
          type: 'text',
          tableName: 't1', // legacy: PR #18, PR #20
          excludeOperators: ['proximity'],
          fieldSettings: {
            validateValue: (val, fieldSettings) => {
              return (
                val.length < 10 &&
                (val === '' || val.match(/^[A-Za-z0-9_-]+$/) !== null)
              );
            }
          },
          mainWidgetProps: {
            valueLabel: 'Login',
            valuePlaceholder: 'Enter login'
          }
        }
      }
    },
    bio: {
      label: 'Bio',
      type: 'text',
      preferWidgets: ['textarea'],
      fieldSettings: {
        maxLength: 1000
      }
    },
    results: {
      label: 'Results',
      type: '!group',
      subfields: {
        product: {
          type: 'select',
          fieldSettings: {
            listValues: ['abc', 'def', 'xyz']
          },
          valueSources: ['value']
        },
        score: {
          type: 'number',
          fieldSettings: {
            min: 0,
            max: 100
          },
          valueSources: ['value']
        }
      }
    },
    cars: {
      label: 'Cars',
      type: '!group',
      mode: 'array',
      conjunctions: ['AND', 'OR'],
      showNot: true,
      operators: [
        // w/ operand - count
        'equal',
        'not_equal',
        'less',
        'less_or_equal',
        'greater',
        'greater_or_equal',
        'between',
        'not_between',

        // w/o operand
        'some',
        'all',
        'none'
      ],
      defaultOperator: 'some',
      initialEmptyWhere: true, // if default operator is not in config.settings.groupOperators, true - to set no children, false - to add 1 empty

      subfields: {
        vendor: {
          type: 'select',
          fieldSettings: {
            listValues: ['Ford', 'Toyota', 'Tesla']
          },
          valueSources: ['value']
        },
        year: {
          type: 'number',
          fieldSettings: {
            min: 1990,
            max: 2020
          },
          valueSources: ['value']
        }
      }
    },
    prox1: {
      label: 'prox',
      tooltip: 'Proximity search',
      type: 'text',
      operators: ['proximity']
    },
    num: {
      label: 'Number',
      type: 'number',
      preferWidgets: ['number'],
      fieldSettings: {
        min: -1,
        max: 5
      },
      funcs: ['LINEAR_REGRESSION']
    },
    slider: {
      label: 'Slider',
      type: 'number',
      preferWidgets: ['slider', 'rangeslider'],
      valueSources: ['value', 'field'],
      fieldSettings: {
        min: 0,
        max: 100,
        step: 1,
        marks: {
          0: <strong>0%</strong>,
          100: <strong>100%</strong>
        },
        validateValue: (val, fieldSettings) => {
          return val < 50 ? null : 'Invalid slider value, see validateValue()';
        }
      },
      //overrides
      widgets: {
        slider: {
          widgetProps: {
            valuePlaceholder: '..Slider'
          }
        },
        rangeslider: {
          widgetProps: {
            valueLabels: [
              { label: 'Number from', placeholder: 'from' },
              { label: 'Number to', placeholder: 'to' }
            ]
          }
        }
      }
    },
    date: {
      label: 'Date',
      type: 'date',
      valueSources: ['value']
    },
    time: {
      label: 'Time',
      type: 'time',
      valueSources: ['value'],
      defaultOperator: 'between'
    },
    datetime: {
      label: 'DateTime',
      type: 'datetime',
      valueSources: ['value', 'func']
    },
    datetime2: {
      label: 'DateTime2',
      type: 'datetime',
      valueSources: ['field']
    },
    color: {
      label: 'Color',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        showSearch: true,
        // * old format:
        // listValues: {
        //     yellow: 'Yellow',
        //     green: 'Green',
        //     orange: 'Orange'
        // },
        // * new format:
        listValues: [
          { value: 'yellow', title: 'Yellow' },
          { value: 'green', title: 'Green' },
          { value: 'orange', title: 'Orange' }
        ]
      }
    },
    color2: {
      label: 'Color2',
      type: 'select',
      fieldSettings: {
        listValues: {
          yellow: 'Yellow',
          green: 'Green',
          orange: 'Orange',
          purple: 'Purple'
        }
      }
    },
    multicolor: {
      label: 'Colors',
      type: 'multiselect',
      fieldSettings: {
        showSearch: true,
        listValues: {
          yellow: 'Yellow',
          green: 'Green',
          orange: 'Orange'
        },
        allowCustomValues: true
      }
    },
    selecttree: {
      label: 'Color (tree)',
      type: 'treeselect',
      fieldSettings: {
        treeExpandAll: true,
        // * deep format (will be auto converted to flat format):
        // listValues: [
        //     { value: "1", title: "Warm colors", children: [
        //         { value: "2", title: "Red" },
        //         { value: "3", title: "Orange" }
        //     ] },
        //     { value: "4", title: "Cool colors", children: [
        //         { value: "5", title: "Green" },
        //         { value: "6", title: "Blue", children: [
        //             { value: "7", title: "Sub blue", children: [
        //                 { value: "8", title: "Sub sub blue and a long text" }
        //             ] }
        //         ] }
        //     ] }
        // ],
        // * flat format:
        listValues: [
          { value: '1', title: 'Warm colors' },
          { value: '2', title: 'Red', parent: '1' },
          { value: '3', title: 'Orange', parent: '1' },
          { value: '4', title: 'Cool colors' },
          { value: '5', title: 'Green', parent: '4' },
          { value: '6', title: 'Blue', parent: '4' },
          { value: '7', title: 'Sub blue', parent: '6' },
          { value: '8', title: 'Sub sub blue and a long text', parent: '7' }
        ]
      }
    },
    multiselecttree: {
      label: 'Colors (tree)',
      type: 'treemultiselect',
      fieldSettings: {
        treeExpandAll: true,
        listValues: [
          {
            value: '1',
            title: 'Warm colors',
            children: [
              { value: '2', title: 'Red' },
              { value: '3', title: 'Orange' }
            ]
          },
          {
            value: '4',
            title: 'Cool colors',
            children: [
              { value: '5', title: 'Green' },
              {
                value: '6',
                title: 'Blue',
                children: [
                  {
                    value: '7',
                    title: 'Sub blue',
                    children: [
                      { value: '8', title: 'Sub sub blue and a long text' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    autocomplete: {
      label: 'Autocomplete',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        asyncFetch: simulatedAsyncFetch,
        useAsyncSearch: true,
        useLoadMore: true,
        forceAsyncSearch: false,
        allowCustomValues: false
      }
    },
    stock: {
      label: 'In stock',
      type: 'boolean',
      defaultValue: true,
      mainWidgetProps: {
        labelYes: '+',
        labelNo: '-'
      }
    }
  };

  //////////////////////////////////////////////////////////////////////

  const funcs = {
    ...BasicFuncs
  };

  const config = {
    conjunctions,
    operators,
    widgets,
    types,
    settings,
    fields: {},
    funcs
  };

  return config;
};
