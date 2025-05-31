const eventConstant = {
	auth: {
		verify: {
			event: 'verify',
			message: {
				success: 'berhasil',
				failed: {
					unauthenticated: 'Unauthenticated.',
					missing: 'Missing authentication.',
				},
			},
		},
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
					invalidGrade: 'kelas (grade) tidak valid.',
					invalidPhoneNumber: 'No. HP tidak valid',
					invalidEmail: 'Email tidak valid.',
					invalidUsername: 'Username hanya boleh kombinasi huruf, angka dan underscore.',
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
		updatePassword: {
			event: 'update-password',
			message: {
				success: 'berhasil',
				failed: {
					mismatch: 'konfirmasi password tidak sama.',
					invalidCurrentPassword: "'password saat ini' salah."
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
					undefinedPosition: 'Posisi tidak ditemukan.',
					differentPositionType: 'Posisi saat ini dan posisi updated berbeda tipe.',
					registeredPhone: 'Nomor HP sudah terdaftar, gunakan nomor lain.',
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
		updateProfileStudentByAdmin: {
			event: 'update-profile-student-by-admin',
			message: {
				success: 'berhasil',
				failed: {
					invalidGrade: 'kelas (grade) tidak valid.',
					notFound: 'profil generus (student) tidak ditemukan.',
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
				failed: {
					notFound: 'data tidak ditemukan.',
				}
			},
		},
		updateByManager: {
			event: 'user-update-by-manager',
			message: {
				success: 'berhasil.',
				failed: 'detail gagal dimuat.',
			},
		},
		download: {
			event: 'download-users',
			message: {
				success: 'berhasil.',
				failed: {
					undownloaded: 'gagal download.',
					errorGenerating: 'file gagal dibuat.',
				},
			},
		},
	},
	userPosition: {
		deleteUserPosition: {
			event: 'delete-user-position',
			message: {
				success: 'berhasil',
				failed: {
					notFound: 'user dengan posisi tersebut tidak ditemukan.'
				}
			},
		},
		hardDeleteUserPosition: {
			event: 'hard-delete-user-position',
			message: {
				success: 'berhasil',
				failed: {
					notFound: 'user dengan posisi tersebut tidak ditemukan.'
				}
			},
		},
		changeUserPosition: {
			event: 'change-user-position',
			message: {
				success: 'berhasil',
				failed: {
					notFound: 'user dengan posisi tersebut tidak ditemukan.',
					notFoundPosition: 'posisi tidak ditemukan.',
					mismatch: 'tipe posisi baru tidak tidak sama dengan tipe yg akan diganti.',
				}
			},
		},
		createUserPosition: {
			event: 'create-user-position',
			message: {
				success: 'berhasil',
				failed: {
					alreadyExists: 'user dengan posisi tersebut sudah ada.',
					notFoundPosition: 'posisi tidak ditemukan.',
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
		create: {
			event: 'create-completion',
			message: {
				success: 'berhasil.',
				failed: {
					undefinedMaterial: 'terdapat materi target tidak ditemukan.',
					alreadyExists: 'terdapat materi target sudah terisi.',
				},
			},
		},
		delete: {
			event: 'delete-completion',
			message: {
				success: 'berhasil.',
				failed: {
					undefinedMaterial: 'terdapat materi target tidak ditemukan.',
				},
			},
		},
		list: {
			event: 'completion-list',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		detail: {
			event: 'completion-detail',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'materi target tidak ditemukan.',
				},
			},
		},
		sum: {
			event: 'completion-sum',
			message: {
				success: 'berhasil.',
				failed: {
					userNotFound: 'materi target dgn user tersebut tidak ditemukan.',
					structureNotFound: 'struktur materi tidak ditemukan.',
					subcategoryNotFound: 'subcategory harus diisi.'
				},
			},
		},
		download: {
			event: 'download-completions',
			message: {
				success: 'berhasil.',
				failed: {
					undownloaded: 'gagal download.',
					errorGenerating: 'file gagal dibuat.',
				},
			},
		},
		getUser: {
			event: 'get-completions-user',
			message: {
				success: 'detail berhasil dimuat.',
				failed: {
					notFound: 'data tidak ditemukan.',
				}
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
		toplist: {
			event: 'event-list-top',
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
					unauthorized: 'Unauthorized.',
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
					notFound: 'kehadiran (presence) tidak ditemukan.',
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
		delete: {
			event: 'delete-presence',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'kehadiran (presence) tidak ditemukan.',
					unauthorized: 'Unauthorized.',
				},
			},
		},
		update: {
			event: 'update-presence',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'kehadiran (presence) tidak ditemukan.',
					unauthorized: 'Unauthorized.',
				},
			},
		},
		download: {
			event: 'download-presence',
			message: {
				success: 'berhasil.',
				failed: {
					undownloaded: 'gagal download.',
					errorGenerating: 'file gagal dibuat.',
					eventNotFound: 'kegiatan (event) tidak tersedia.',
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
	material: {
		list: {
			event: 'material-list',
			message: {
				success: 'berhasil.',
				failed: 'gagal.',
			},
		},
		detail: {
			event: 'material-detail',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'materi target tidak ditemukan.'
				},
			},
		},
		targetMonth: {
			event: 'material-target-month',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'materi target tidak ditemukan.',
					invalidMonth: 'bulan tidak valid.',
				},
			},
		},
	},
	directory: {
		create: {
			event: 'create-directory',
			message: {
				success: 'berhasil.',
				failed: {
					alreadyExists: 'File dengan nama yang sama sudah pernah dibuat.',
					invalidType: 'Tipe hanya boleh PUBLIC/PRIVATE.',
				},
			},
		},
		delete: {
			event: 'delete-directory',
			message: {
				success: 'berhasil.',
				failed: {
					notFound: 'data tidak ditemukan',
				},
			},
		},
	},
}

module.exports = eventConstant
