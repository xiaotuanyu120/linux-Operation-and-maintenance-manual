加密软件truecrypt官网事件
2015年10月30日 星期五
9:59
 
WARNING: Using TrueCrypt is not secure as it may contain unfixed security issues
 
This page exists only to help migrate existing data encrypted by TrueCrypt.
 
The development of TrueCrypt was ended in 5/2014 after Microsoft terminated support of Windows XP. Windows 8/7/Vista and later offer integrated support for encrypted disks and virtual disk images. Such integrated support is also available on other platforms (click here for more information). You should migrate any data encrypted by TrueCrypt to encrypted disks or virtual disk images supported on your platform.
 
 
Migrating from TrueCrypt to BitLocker:
 
If you have the system drive encrypted by TrueCrypt:
1. Decrypt the system drive (open System menu in TrueCrypt and select Permanently Decrypt System Drive). If you want to encrypt the drive by BitLocker before decryption, disable Trusted Platform Module first and do not decrypt the drive now.
2. Encrypt the system drive by BitLocker. Open the Explorer:

3. Click the drive C: (or any other drive where system encryption is or was used) using the right mouse button and select Turn on BitLocker:

If you do not see the Turn on BitLocker menu item, click here.

Alternatively, use search in the Start menu or screen:

If you do not see the BitLocker item, click here.

If BitLocker reports Trusted Platform Module (TPM) unavailable error, click here.
4. If the system drive is still encrypted by TrueCrypt, decrypt it now (open System menu in TrueCrypt and select Permanently Decrypt System Drive).
 
If you have a non-system drive encrypted by TrueCrypt:
1. If you have a spare or backup drive (having sufficient space to store all data you need to migrate to BitLocker), encrypt it by BitLocker (click the drive in Explorer using the right mouse button and select Turn on BitLocker):

If you do not see the Turn on BitLocker menu item, click here.
2. Copy all data from the drive encrypted by TrueCrypt to the drive encrypted by BitLocker.

If you do not have a spare drive, first decrypt the drive encrypted by TrueCrypt. Select the drive in TrueCrypt, open the Volumes menu and select Permanently Decrypt item (available in version 7.2). Then encrypt the drive by BitLocker (see above).

To mount a drive encrypted by BitLocker, open the drive in Explorer.

To dismount a removable drive encrypted by BitLocker, use Eject menu item or Safely Remove icon:

To dismount a non-removable drive encrypted by BitLocker, use Offline item in the context menu of the drive in Disk Management window:

To mount the drive again, use Online item in the context menu of the drive.
If you have a file container encrypted by TrueCrypt: 
1. Create a new virtual disk file (VHD). Open the Computer Management window (click the Computer or PC icon using the right mouse button and select Manage):

2. Select the Disk Management item:

Alternatively, use search in the Start menu or screen:

3. Open Action menu in the Disk Management window and select Create VHD:

4. Create and attach a new virtual disk file (VHD):

5. Initialize the new virtual drive. Click the new disk icon using the right mouse button and select Initialize Disk:

6. Create a partition on the virtual drive. Click the unallocated space using the right mouse button and select New Simple Volume:

7. Encrypt the new virtual drive by BitLocker. Click the drive in Explorer using the right mouse button and select Turn on BitLocker:

If you do not see the Turn on BitLocker menu item, click here.
8. Copy all data from the mounted TrueCrypt file container to the new virtual drive encrypted by BitLocker.

To dismount the drive, click the drive using the right mouse button in Explorer and select Eject:

To mount the drive again, double click the virtual disk file (requires Windows 8 or later):

Alternatively, use Attach VHD in the Action menu of the Disk Management window:

 
Download:
 
WARNING: Using TrueCrypt is not secure
 
You should download TrueCrypt only if you are migrating data encrypted by TrueCrypt.
 
TrueCrypt 7.2           sig key
 
If you use TrueCrypt on other platform than Windows, click here.
 
来自 <http://truecrypt.sourceforge.net/> 
 
 
番外1：
============================================
The development of TrueCrypt, an open source piece of software used for on-the-fly encryption, has been terminated and users have been advised not to use it because it is not secure enough. Now, it seems that another team of developers have forked the software and rebased it in Switzerland. 
 
The abrupt announcement of the demise of TrueCrypt took everyone by surprise and some of its users have been disappointed that their favorite software is no longer being developed. The Sourceforge website, where the project was keeping its files, is now plastered with warnings that TrueCrypt is no longer secure because it is full of security issues.
 
Fortunately for us, TrueCrypt was an open source project and that meant that anyone could take it and fork it into another version, and try to fix some of the problems reported. Whether this will be a success remains to be seen, but at least there is a chance that it will live on.
 
Many users think that the TrueCrypt project has been forced to close its doors by various other malevolent forces, like the US government, for example. To be fair, the US government is accused of many such acts, but it is likely that it's not actually responsible for all of them.
 
So, TrueCrypt has now been rebased in Switzerland and the project has been forked by another team of developers. They are promising that the security problems will be fixed and that no one will be able to force them to close the gates.
 
"Currently it is very unclear what really happened. Was it really just the end of a 10 year effort, or was it driven by some government？ While a simple defacement is more and more unlikely we still don't know where this is going. However the last 36 hours showed clearly that TrueCrypt is a fragile product and must be based on more solid ground. We start now with offering to download the Truecrypt file as is, and we hope we can organize a solid base for the Future," reads the new truecrypt.ch website.
 
曾获包括斯诺登（Edward Snowden）在内的专业人士推荐并使用过的流行达十年之久的著名加密软件TrueCrypt，于2014年5月28日突遭关闭，其官方网站被重定向到 SourceForge网页并且警告称该软件并不安全，建议所有TrueCrypt用户将加密的数据迁移到Bitlocker，这一消息对于很多习惯了使 用TrueCrypt的用户来说犹如一颗重磅炸弹！TrueCrypt项目究竟发生了什么？对于TrueCrypt突遭神秘关闭的背景、真实原因，一时间 各种猜测纷至沓来：网站被黑、有人恶作剧、主要开发者已经放弃开发甚至已经死亡、项目被NSA盯上并遭到胁迫、发现重大安全漏洞甚至已经被胁迫植入后门等 等。
 
真正的背景如何，有待进一步观察。不过已经有一些热心的网友开始行动起来准备拯救他们一直以来心爱的加密软件，一个瑞士的开发者团队刚刚组建了TrueCrypt新的网上家园。他们决心修复TrueCrypt的安全漏洞并且承诺没有人能够强迫他们关闭大门！
 
参见：
 
Steve Gibson: TrueCrypt is still safe to use（TrueCrypt仍然可以安全使用）
 
TrueCrypt瑞士开发团队官网：If TrueCrypt.org really is dead, we will try to organize a future.
 
来自 <http://bbs.kafan.cn/thread-1739608-1-1.html> 
 
 
番外2：
===========================================
And then the TrueCrypt developers were heard from . . .
Steven Barnhart (@stevebarnhart) wrote to an eMail address he had used before and received several replies from "David." The following snippets were taken from a twitter conversation which then took place between Steven Barnhart (@stevebarnhart) and Matthew Green (@matthew_d_green):
 
    TrueCrypt Developer "David": "We were happy with the audit, it didn't spark anything. We worked hard on this for 10 years, nothing lasts forever."
    Steven Barnhart (Paraphrasing): Developer "personally" feels that fork is harmful: "The source is still available as a reference though."
    Steven Barnhart: "I asked and it was clear from the reply that "he" believes forking's harmful because only they are really familiar w/code."
    Steven Barnhart: "Also said no government contact except one time inquiring about a 'support contract.' "
    TrueCrypt Developer "David" said: "Bitlocker is 'good enough' and Windows was original 'goal of the project.' "
    Quoting TrueCrypt Developer David: "There is no longer interest."
TrueCrypt is software. Frankly, it's incredibly great software. It's large, complex and multi-platform. It has been painstakingly designed and implemented to provide the best security available anywhere. And it does. It is the best and most secure software modern computer science has been able to create. It is a miracle, and a gift, and it has been a labor of love we have toiled away, thanklessly for a decade, to provide to the world... for free.
*********************************************************************
TrueCrypt is open source. Anyone could verify it, trust it, give back, contribute time, talent or money and help it to flourish. But no one has helped. Most just use it, question it and criticize it, while requiring it to be free, and complaining when it doesn't work with this or that new system.
 
After ten years of this mostly thankless and anonymous work, we're tired. We've done our part. We have what we want. And we feel good about what we have created and freely given. Do we use it?  Hell yes.  As far as we know, TrueCrypt is utterly uncrackable, and plenty of real world experience, and ruthlessly still-protected drives, back up that belief.
 
But hard drives have finally exceeded the traditional MBR partition table's 32-bit sector count. 2.2 terabytes is not enough. So the world is moving to the GPT. But we're not. We're done. You're on your own now. No more free lunch.
 
We're not bitter. Mostly we're just tired and done with TrueCrypt. Like we wrote above, as far as we know today, it is a flawless expression of cryptographic software art. And we're very proud of it. But TrueCrypt, which we love, has been an obligation hanging over our heads for so long that we've decided to not only shut it down, but to shoot it in the head. If you believe we're not shooting blanks you may want to switch to something else. Our point is, now, finally, it's on you, not us.
 
Good luck with your NSA, CIA, and FBI.
 
来自 <http://bbs.kafan.cn/thread-1739608-1-1.html> 
 
