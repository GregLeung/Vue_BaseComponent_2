import Vue from 'vue'
import {
    BaseFooter,
    BaseTable,
    BasePagingTable,
    BaseUploadButton,
    CMSHeader,
    NavigationBar,
    NavigationBarToggleButton,
    LoginContainerBox,
    LoginInput,
    BaseCamera,
    CMSForm,
    CMSFormInput,
    CMSDatePicker,
    CMSSelector,
    // CMSPhotoUpload,
    CMSRadioBox,
    CMSInputNumber,
    CMSBreadcrumb,
    CMSContainer,
    CMSPageHeader,
    NewCMSSelector,
    BaseLabel,
    IconField,
    BaseFab,
    LanguageButton,
    HalfRow,
    IconButton,
    SignaturePad,
    CustomFormInput,
    SimpleTable,
    PanelBox,
    DefaultLayout,
    BaseGridTable,
    MyAccount,
    ChangePassword,
    CMSCheckBox,
    LogTile,
    ChangeLog,
    BaseCheckBox,
    BaseCheckBoxGroup,
    StandardDialog,
    StandardDrawer,
    NewCMSForm,
} from 'vue_basecomponent'

const components = { 
    BaseFooter, BaseTable, BasePagingTable, BaseUploadButton,
    CMSHeader, NavigationBar, NavigationBarToggleButton,
    LoginContainerBox, LoginInput, BaseCamera,
    CMSForm, CMSFormInput, CMSDatePicker, CMSSelector,
    // CMSPhotoUpload,
    CMSRadioBox, CMSInputNumber, CMSBreadcrumb,
    CMSContainer, CMSPageHeader, NewCMSSelector,
    BaseLabel, IconField, BaseFab,
    LanguageButton, HalfRow, IconButton,
    SignaturePad, CustomFormInput, SimpleTable,
    PanelBox, DefaultLayout, BaseGridTable,
    MyAccount, ChangePassword, CMSCheckBox,
    LogTile, ChangeLog, BaseCheckBox,
    BaseCheckBoxGroup, StandardDialog,
    StandardDrawer, NewCMSForm
}

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
})