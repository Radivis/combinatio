import { ChangeEventHandler } from "react";


interface booleanSettingProps {
    setting: boolean;
    settingName: string;
    settingLabel: string;
    onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

const BooleanSetting = (props: booleanSettingProps) => {

    const { setting, settingName, settingLabel, onChangeHandler } = props;

return (
    <div className="settings-row">
        <label htmlFor="areSlotHintsActive">{`${settingLabel}: `}</label>
        Yes: <input
            name={settingName}
            type="radio"
            value="true"
            checked={setting === true}
            onChange={onChangeHandler}
        />
        No: <input
            name={settingName}
            type="radio"
            value="false"
            checked={setting === false}
            onChange={onChangeHandler}
        />
    </div>
);

}

export default BooleanSetting;