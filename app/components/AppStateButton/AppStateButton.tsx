import React from 'react';
import { I18n } from 'react-redux-i18n';
import {
    Box,
    Fab,
    Typography,
    CircularProgress,
    Tooltip
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import RefreshIcon from '@material-ui/icons/Refresh';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { getAppStatusText } from '$Utils/app_utils';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

import styles from './AppStateButton.css';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resetAppInstallationState: Function;
    resumeDownload: Function;
    showAppStatus?: boolean;
    application: App;
}

export class AppStateButton extends React.Component<Props> {
    handleDownload = () => {
        const { application, downloadAndInstallApp } = this.props;
        logger.verbose(
            'ApplicationOverview: clicked download ',
            application.name
        );
        downloadAndInstallApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.verbose( 'ApplicationOverview: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, unInstallApp } = this.props;
        logger.verbose( 'ApplicationOverview: clicked uninstall', application );
        unInstallApp( application );
    };

    resetInstallation = () => {
        const { application, resetAppInstallationState } = this.props;
        logger.verbose( 'ApplicationOverview: clicked cancel', application );
        resetAppInstallationState( application );
    };

    handleResumeDownload = () => {
        const { application, resumeDownload } = this.props;
        logger.verbose(
            'ApplicationOverview: clicked resume download',
            application
        );
        resumeDownload( application );
    };

    handlePauseDownload = () => {
        const { application, pauseDownload } = this.props;
        logger.verbose(
            'ApplicationOverview: clicked pause download',
            application
        );
        pauseDownload( application );
    };

    render() {
        const { application, showAppStatus = false } = this.props;

        const {
            isDownloadingAndInstalling,
            isInstalled,
            isOpen, // ?
            isDownloadingAndUpdating, // does this entail installing?
            isUninstalling,
            isPaused,
            hasUpdate,
            installFailed,
            progress,
            error
        } = application;

        let buttonText = isInstalled
            ? I18n.t( `buttons.open` )
            : I18n.t( `buttons.install` );

        let handleClick = isInstalled ? this.handleOpen : this.handleDownload;
        const progressText = getAppStatusText( application );
        const statusMessage = showAppStatus ? error || progressText : null;
        let progressButtonIcon;

        const pauseIconButton = (
            <PauseCircleFilledIcon
                aria-label="Pause Button"
                className={styles.pauseButton}
            />
        );

        if ( error ) {
            buttonText = I18n.t( `buttons.cancelInstall` );
            progressButtonIcon = (
                <CancelIcon
                    className={styles.cancelButton}
                    aria-label="cancelButton"
                />
            );
            handleClick = this.resetInstallation;
        }

        if ( isDownloadingAndInstalling ) {
            buttonText = I18n.t( `buttons.pause` );
            handleClick = this.handlePauseDownload;
            progressButtonIcon = pauseIconButton;
        }

        if ( isDownloadingAndUpdating ) {
            buttonText = I18n.t( `buttons.pause` );
            progressButtonIcon = pauseIconButton;
        }

        if ( isPaused ) {
            buttonText = I18n.t( `buttons.resume` );
            handleClick = this.handleResumeDownload;
            progressButtonIcon = <RefreshIcon aria-label="refreshButton" />;
        }

        if ( isUninstalling ) {
            buttonText = I18n.t( `buttons.uninstalling` );
        }

        const percentageProgress = progress * 100;

        return (
            <Box className={styles.wrap}>
                {!isInstalled && progressButtonIcon && (
                    <Box className={styles.progressButton}>
                        <Tooltip title={buttonText} placement="top">
                            <Fab
                                color="primary"
                                className={styles.progressFab}
                                onClick={handleClick}
                                aria-label="Application Action Button"
                            >
                                {progressButtonIcon}
                            </Fab>
                        </Tooltip>
                        <CircularProgress
                            value={percentageProgress}
                            variant="static"
                            className={`${styles.progress} ${
                                isDownloadingAndInstalling && !isPaused
                                    ? styles.active
                                    : ''
                            }`}
                        />
                    </Box>
                )}
                {!progressButtonIcon && (
                    <Fab
                        variant="extended"
                        color="primary"
                        onClick={handleClick}
                        aria-label="Application Action Button"
                        disabled={!!isUninstalling}
                        className={styles.actionButton}
                    >
                        {buttonText}
                    </Fab>
                )}

                {statusMessage && (
                    <Typography
                        color={error ? 'error' : 'textSecondary'}
                        variant="body2"
                        className={styles.statusMessage}
                    >
                        {statusMessage}
                    </Typography>
                )}
            </Box>
        );
    }
}
