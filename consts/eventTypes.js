export default {
    user: {
        login: {
            event: 'login',
            message: {
                success: 'login berhasil',
                failed: {
                    incorrectPhoneOrPassword: 'No. HP atau password salah.',
                },
            },
        },
        register: {
            event: 'register',
            message: {
                success: 'register berhasil',
                failed: {
                    undefinedCredentials: 'No. HP atau email harus diisi',
                    registeredCredentials: 'No. HP, email atau username sudah terdaftar',
                    invalidData: 'data tidak valid',
                    invalidDate: 'tanggal tidak valid',
                },
            },
        },
        updateProfile: {
            event: 'update_profile',
            message: {
                success: 'berhasil',
                failed: {
                    invalidBirthdate: 'tanggal lahir (birthdate) tidak valid'
                }
            },
        },
        resetPassword: {
            event: 'reset_password',
            message: {
                success: 'berhasil',
                failed: {
                    invalidToken: 'token tidak valid'
                }
            },
        },
        forgotPassword: {
            event: 'forgot_password',
            message: {
                success: 'berhasil',
                failed: {
                    notFoundEmailOrPassowrd: 'email atau No. HP tidak terdaftar'
                }
            },
        },
        deleteUser: {
            event: 'delete_user',
            message: {
                success: 'berhasil',
                failed: {
                    notFound: 'user tidak ditemukan'
                }
            },
        },
    },
    // user1: {
    //     list: {
    //         event: 'user-list',
    //         message: {
    //             success: 'List berhasil dimuat.',
    //             failed: 'List gagal dimuat.',
    //         },
    //     },
    //     detail: {
    //         event: 'user-detail',
    //         message: {
    //             success: 'Detail berhasil dimuat.',
    //             failed: 'Detail gagal dimuat.',
    //         },
    //     },
    // },
    // position: {
    //     list: {
    //         event: 'position-list',
    //         message: {
    //             success: 'List berhasil dimuat.',
    //             failed: 'List gagal dimuat.',
    //         },
    //     },
    // },
    // organization: {
    //     list: {
    //         event: 'organization-list',
    //         message: {
    //             success: 'List berhasil dimuat.',
    //             failed: 'List gagal dimuat.',
    //         },
    //     },
    // },
    // media: {
    //     upload: {
    //         event: 'upload',
    //         message: {
    //             success: 'Upload media berhasil.',
    //             failed: 'Upload media gagal.',
    //         },
    //     },
    // },
    // activityType: {
    //     list: {
    //         event: 'activity-type-list',
    //         message: {
    //             success: 'List berhasil dimuat.',
    //             failed: 'List gagal dimuat.',
    //         },
    //     },
    // },
    // activity: {
    //     list: {
    //         event: 'activity-list',
    //         message: {
    //             success: 'List berhasil dimuat.',
    //             failed: 'List gagal dimuat.',
    //         },
    //     },
    //     detail: {
    //         event: 'activity-detail',
    //         message: {
    //             success: 'Detail berhasil dimuat.',
    //             failed: 'Aktivitas tidak ditemukan.',
    //         },
    //     },
    //     delete: {
    //         event: 'activity-delete',
    //         message: {
    //             success: 'Berhasil hapus data.',
    //             failed: {
    //                 activityNotFound: 'Aktivitas tidak ditemukan.',
    //             },
    //         },
    //     },
    //     create: {
    //         event: 'activity-create',
    //         message: {
    //             success: 'Berhasil membuat data.',
    //             failed: {
    //                 activityTypeNotFound: 'Tipe kegiatan (activityType) tidak tersedia.',
    //             },
    //         },
    //     },
    // },
}
