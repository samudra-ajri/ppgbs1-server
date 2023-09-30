const eventConstant = {
	auth: {
		login: {
			event: 'login',
			message: {
				success: 'login berhasil',
				failed: {
					incorrectPhoneOrPassword: 'No. HP, email, username atau password salah.',
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
					incorrectPasswordCombination: 'konfirmasi password tidak sama.',
					undefinedPosition: 'Posisi tidak ditemukan.',
					invalidBirthdate: 'tanggal lahir (birthdate) tidak valid.',
				},
			},
		},
		tempPassword: {
			event: 'temp-password',
			message: {
				success: 'berhasil',
				failed: {
					invalidToken: 'token tidak valid'
				}
			},
		},
		forgotPassword: {
			event: 'forgot-password',
			message: {
				success: 'berhasil',
				failed: {
					notFound: 'No. HP, email atau username tidak terdaftar.'
				}
			},
		},
		resetPassword: {
			event: 'reset-password',
			message: {
				success: 'berhasil',
				failed: {
					mismatch: 'konfirmasi password tidak sama.',
					invalid: 'token atau password semetara (tempPassword) salah.'
				}
			},
		},
		me: {
			event: 'me',
			message: {
				success: 'detail berhasil dimuat.',
				failed: 'detail gagal dimuat.',
			},
		},
		switchPosition: {
			event: 'switch-position',
			message: {
				success: 'berhasil.',
				failed: {
					undefinedPosition: 'Posisi tidak ditemukan.',
				}
			},
		},
	},
	user: {
		updateProfile: {
			event: 'update-profile',
			message: {
				success: 'berhasil',
				failed: {
					invalidBirthdate: 'tanggal lahir (birthdate) tidak valid.',
					incorrectPasswordCombination: 'konfirmasi password tidak sama.',
				}
			},
		},
		updateProfileStudent: {
			event: 'update-profile-student',
			message: {
				success: 'berhasil',
				failed: {
					invalidGrade: 'kelas (grade) tidak valid.',
					notFound: 'profil generus (student) tidak ditemukan.',
				}
			},
		},
		updateProfileTeacher: {
			event: 'update-profile-teacher',
			message: {
				success: 'berhasil',
				failed: {
					notFound: 'profil pengajar (teacher) tidak ditemukan.',
				}
			},
		},
		deleteUser: {
			event: 'delete-user',
			message: {
				success: 'berhasil',
				failed: {
					notFound: 'user tidak ditemukan'
				}
			},
		},
		list: {
			event: 'user-list',
			message: {
				success: 'list berhasil dimuat.',
				failed: 'list gagal dimuat.',
			},
		},
		forgotPasswordlist: {
			event: 'forogt-password-list',
			message: {
				success: 'list berhasil dimuat.',
				failed: 'list gagal dimuat.',
			},
		},
		detail: {
			event: 'user-detail',
			message: {
				success: 'detail berhasil dimuat.',
				failed: 'detail gagal dimuat.',
			},
		},
		updateByManager: {
			event: 'user-update-by-manager',
			message: {
				success: 'berhasil.',
				failed: 'detail gagal dimuat.',
			},
		},
	},
	userPosition: {
		deleteUserPosition: {
			event: 'delete-user-position',
			message: {
				success: 'berhasil',
				failed: {
					notFound: 'user dengan posisi tersebut tidak ditemukan'
				}
			},
		},
	},
	attendance: {
		create: {
			event: 'create-attendance',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'kehadiran (Attendances) tidak ditemukan.',
					eventNotFound: 'event tidak ditemukan.',
					wrongAccessCode: 'kode akses salah.',
					alreadyAttend: 'sudah mengisi daftar hadir.',
				},
			},
		},
		list: {
			event: 'attendance-list',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'kehadiran (Attendances) tidak ditemukan.',
				},
			},
		},
		isAttended: {
			event: 'check-is-attended',
			message: {
				success: 'berhasil.',
				failed: {
					eventNotFound: 'event tidak ditemukan.',
				},
			},
		},
	},
	completion: {
		detail: {
			event: 'completion-detail',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'user completion tidak ditemukan.',
				},
			},
		},
		detailBySubject: {
			event: 'completion-detail-by-subject',
			message: {
				success: 'berhasil.',
				failed: 'gagal',
			},
		},
		detailBySubjectUserBased: {
			event: 'completion-detail-by-subject-user-based',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'user completion tidak ditemukan.',
				},
			},
		},
		create: {
			event: 'create-completion',
			message: {
				success: 'berhasil.',
				failed: {
					invalid: 'data tidak valid',
				},
			},
		},
		update: {
			event: 'update-completion',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'user completion tidak ditemukan.',
				},
			},
		},
		delete: {
			event: 'delete-completion',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'user completion tidak ditemukan.',
				},
			},
		},
		listAdmin: {
			event: 'completion-list-admin',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		detailAdmin: {
			event: 'completion-detail-admin',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'user completion tidak ditemukan'
				},
			},
		},
		listUser: {
			event: 'completion-list-user',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		listUserBased: {
			event: 'completion-list-user-based',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'user completion tidak ditemukan'
				},
			},
		},
		listByCategory: {
			event: 'completion-list-by-category',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		listUserBasedByCategory: {
			event: 'completion-list-user-based-category',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		listScore: {
			event: 'completion-list-score',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		listScoreAll: {
			event: 'completion-list-score-all',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		listScoreByUserId: {
			event: 'completion-list-score-by-userid',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		listSubjectDetailsScores: {
			event: 'completion-list-subject-detail-score',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
	},
	dashboard: {
		detail: {
			event: 'dashboard-detail',
			message: {
				success: 'berhasil.',
				failed: 'gagal',
			},
		},
	},
	event: {
		create: {
			event: 'create-event',
			message: {
				success: 'berhasil.',
				failed: {
					invalidData: 'data tidak valid',
				},
			},
		},
		list: {
			event: 'event-list',
			message: {
				success: 'berhasil.',
				failed: {
					invalidData: 'data tidak valid',
				},
			},
		},
		listAdmin: {
			event: 'event-list-admin',
			message: {
				success: 'berhasil.',
				failed: {
					invalidData: 'data tidak valid',
				},
			},
		},
		detail: {
			event: 'event-detail',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'data tidak ditemukan',
				},
			},
		},
		update: {
			event: 'update-event',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'data tidak ditemukan',
				},
			},
		},
		delete: {
			event: 'delete-event',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'data tidak ditemukan',
				},
			},
		},
	},
	home: {
		detail: {
			event: 'home',
			message: {
				success: 'berhasil.',
				failed: 'gagal',
			},
		},
	},
	location: {
		create: {
			event: 'create-location',
			message: {
				success: 'berhasil.',
				failed: {
					alreadyExists: 'Ds already added.',
					invalidData: 'data tidak valid.',
				},
			},
		},
		update: {
			event: 'update-location',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'lokasi tidak ditemukan.',
				},
			},
		},
		delete: {
			event: 'delete-location',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'lokasi tidak ditemukan.',
				},
			},
		},
		list: {
			event: 'location-list',
			message: {
				success: 'berhasil.',
				failed: 'gagal',
			},
		},
		detail: {
			event: 'location-detail',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'lokasi tidak ditemukan.',
				},
			},
		},
	},
	presence: {
		create: {
			event: 'create-presence',
			message: {
				success: 'berhasil.',
				failed: {
					wrongAccessCode: 'kode akses salah.',
					alreadyExists: 'sudah mengisi daftar hadir.',
					eventNotFound: 'kegiatan (event) tidak tersedia.',
				},
			},
		},
		list: {
			event: 'list-presence',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'presence tidak ditemukan.',
				},
			},
		},
		detail: {
			event: 'detail-presence',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'presence tidak ditemukan.',
				},
			},
		},
		isPresent: {
			event: 'is-present',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'presence tidak ditemukan.',
				},
			},
		},
		createByAdmin: {
			event: 'create-presence-by-admin',
			message: {
				success: 'berhasil.',
				failed: {
					alreadyExists: 'generus sudah hadir.',
					eventNotFound: 'kegiatan (event) tidak tersedia.',
					userNotFound: 'generus tidak ditemukan.',
				},
			},
		},
		deleteAttender: {
			event: 'delete-attender',
			message: {
				success: 'berhasil.',
				failed: {
					eventNotFound: 'kegiatan (event) tidak tersedia.',
					userNotFound: 'generus tidak ditemukan.',
				},
			},
		},
	},
	subject: {
		create: {
			event: 'create-subject',
			message: {
				success: 'berhasil.',
				failed: {
					alreadyExists: 'subjek sudah terdaftar.',
					invalidData: 'data tidak valid.',
				},
			},
		},
		list: {
			event: 'subject-list',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		listByCategory: {
			event: 'subject-list-by-category',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'subjek tidak ditemukan.',
				},
			},
		},
		detail: {
			event: 'subject-detail',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'subjek tidak ditemukan.',
				},
			},
		},
		categoryBased: {
			event: 'subject-category-based',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'subjek tidak ditemukan.',
				},
			},
		},
		update: {
			event: 'update-subject',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'subjek tidak ditemukan.',
				},
			},
		},
		delete: {
			event: 'delete-subject',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'subjek tidak ditemukan.',
				},
			},
		},
	},
}

module.exports = eventConstant
